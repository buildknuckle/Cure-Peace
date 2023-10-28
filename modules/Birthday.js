const cron = require('node-cron');
const DB = require("./Database");
const DBM_Birthday = require('../models/BirthdayModel');
const DBM_Birthday_Guild = require('../models/BirthdayGuildModel');

const DBM_BirthdayGuildInst = new DBM_Birthday_Guild();
const DBM_BirthdayInst = new DBM_Birthday();

/**
 * Gets config
 * @param id_guild - Guild ID
 * @returns {Promise<boolean>}
 */
async function isGuildEnabled(id_guild) {

    const guild_config = await getGuildConfig(id_guild,false);
    return guild_config.enabled === 1;
}
/**
 * Gets config
 * @param id_guild - Guild ID
 * @param insertNew - Whether to insert the current guild if it isn't in the DB yet
 * @returns {Promise<*>}
 */
async function getGuildConfig(id_guild, insertNew = true) {

    let parameterWhere = new Map();
    parameterWhere.set("id_guild", id_guild);

    let columns = [
        DBM_BirthdayGuildInst.fields.id_guild,
        DBM_BirthdayGuildInst.fields.id_notification_channel,
        `HOUR(${DBM_BirthdayGuildInst.fields.notification_hour}) AS 'hour'`,
        DBM_BirthdayGuildInst.fields.enabled,
    ];
   
    let data = await DB.select(DBM_BirthdayGuildInst.tableName, parameterWhere);

    // insert
    if (insertNew) {
        if (data == null) {

            let parameter = new Map();
            parameter.set(DBM_BirthdayGuildInst.fields.id_guild, id_guild);
            parameter.set(DBM_BirthdayGuildInst.fields.id_notification_channel, null);
            parameter.set(DBM_BirthdayGuildInst.fields.notification_hour, '09:00:00');
            parameter.set(DBM_BirthdayGuildInst.fields.enabled, 0);

            await DB.insert(DBM_BirthdayGuildInst.tableName, parameter);
            data = await DB.selectAll(DBM_BirthdayGuildInst.tableName, parameterWhere);

            return await data;
        } else {
            return data;
        }
    }
    return data;
}

/**
 * Gets all birthdays in the database for this guild
 * @param guild
 * @returns {Promise<*>}
 */
async function getListOfBDsForThisServer(guild) {

    let parameterWhere = new Map();
    parameterWhere.set(DBM_BirthdayGuildInst.fields.id_guild, guild);
    // override to be DAC
    // parameterWhere.set(DBM_BirthdayGuildInst.fields.id_guild, '314512031313035264');
    parameterWhere.set(DBM_BirthdayGuildInst.fields.enabled, 1);

    const columns = [
        DBM_BirthdayInst.fields.id_user,
        DBM_BirthdayInst.fields.birthday,
        `MONTH(${DBM_BirthdayInst.fields.birthday}) AS 'month'`,
        `DAY(${DBM_BirthdayInst.fields.birthday}) AS 'day'`,
        DBM_BirthdayInst.fields.label,
        DBM_BirthdayInst.fields.notes
    ];
    let parameterOrderBy = new Map();
    parameterOrderBy.set('month', 'ASC');
    parameterOrderBy.set('day', 'ASC');
    return await DB.selectColumnsIn(DBM_BirthdayInst.tableName, columns, parameterWhere);

//     const query = `SELECT ${DBM_BirthdayInst.fields.id_user},
//                           ${DBM_BirthdayInst.fields.birthday},
//                           MONTH(${DBM_BirthdayInst.fields.birthday}) as 'month',
//                           DAY(${DBM_BirthdayInst.fields.birthday})   AS 'day',
//                           label,
//                           notes
//                    FROM birthday
//                    WHERE ${DBM_BirthdayInst.fields.id_guild} = '314512031313035264'
//                      AND ${DBM_BirthdayInst.fields.enabled} = '1'
// #                    WHERE ${DBM_BirthdayInst.fields.id_guild} = '${guild}' AND ${DBM_BirthdayInst.fields.enabled} = '1'
//                    ORDER BY month, day`;
//     let foo = await DBConn.conn.query(query);
//     return await foo;
}

/**
 * Generates the reminder message in the defined notification channel
 * @param birthday - Birthday object
 * @type {(birthday: object) => string}
 * @returns {Promise<string>}
 */
async function generateNotification(birthday) {
    let output = `It's <@${birthday.id_user}>'s birthday today.`;
    if (birthday.notes) {
        output += ` Notes about them: \`${birthday.notes}\``;
    }
    return output;
}

/**
 *
 * @param birthdays
 * @param client - Discord client object
 * @param assignedChannel - channel ID where to send reminders to
 * @param hour - GMT hour when to send reminders
 // * @type {(client: Discord.client, assignedChannel: string) => ScheduledTask}
 * @returns {Promise<ScheduledTask>}
 */
async function schedulerSetup(birthdays, client, assignedChannel, hour) {
    hour = hour != null ? hour : '9';
    hour= hour.length === 1 ? `0${hour}}` : hour;

    return new cron.schedule(`0 0 ${hour} * * *`, async () => {

        let today = new Date();

        for (const birthdayObject of birthdays) {
            if (birthdayObject instanceof Object) {
                let birthday = birthdayObject;

                // console.log(`${60 - (birthday.month + birthday.day)} (${birthday.month} ${birthday.day})`);
                if (birthday.month === (today.getUTCMonth() + 1) && birthday.day === today.getUTCDate()) {
                    // if(60 - (birthday.month + (birthday.day * 3)) === today.getMinutes()) {
                    // if (birthday.day + birthday.month === today.getMinutes().toString()) {
                    console.log('BIRTHDAY!');
                    let message = await generateNotification(birthday);

                    let channel = await client.channels.cache.find(assignedChannel);

                    channel.send(message);
                    console.log(message);
                }
            }
        }
    }, {
        scheduled: false,
        timezone: 'Europe/London'
    });
}

/**
 * Checks if there's a birthday in the DB for this user in this guild
 * @param id_guild
 * @param id_user
 * @returns {Promise<*>}
 */
async function doesBirthdayExist(id_guild, id_user) {

    let parameterWhere = new Map();
    parameterWhere.set(DBM_BirthdayInst.fields.id_guild, id_guild);
    parameterWhere.set(DBM_BirthdayInst.fields.id_user, id_user);

    return await DB.select(DBM_BirthdayInst.tableName, parameterWhere);
}

/**
 * Re-enables pinging again for this guild.
 * @param guild
 * @param {string|null} setChannel
 * @param {number|null|undefined} [setHour]
 * @param {boolean|undefined} [setEnabled]
 * @returns {Promise<any>}
 */
async function setGuildConfig(guild, setChannel, setHour, setEnabled) {

    let parameterSet = new Map();
    if (setChannel)
        parameterSet.set(DBM_BirthdayGuildInst.fields.id_notification_channel, setChannel);
    if (setHour !== undefined && setHour != null) {

        // time.setHours(setHour);
        let newHour = (setHour.toString().length === 1) ? `0${setHour}` : setHour;
        parameterSet.set(DBM_BirthdayGuildInst.fields.notification_hour, `${newHour}:00:00`);
    }

    if (setEnabled !== undefined) {

        parameterSet.set(DBM_BirthdayGuildInst.fields.enabled, setEnabled === true ? 1 : 0);
    }

    let parameterWhere = new Map();
    parameterWhere.set(DBM_BirthdayGuildInst.fields.id_guild, guild);

    return await DB.update(DBM_BirthdayInst.tableName, parameterSet, parameterWhere);
}

/**
 * Adds birthday of the user for this guild to the DB
 * @param id_guild
 * @param id_user
 * @param birthday
 * @param label
 * @param notes
 * @returns {Promise<string>}
 */
async function addBirthday(id_guild, id_user, birthday, label, notes) {

    let haveBirthday = await doesBirthdayExist(id_guild, id_user);
    if (haveBirthday != null) {
        return 'BIRTHDAY_EXISTS';
    }

    let parameters = new Map();
    parameters.set(DBM_BirthdayInst.fields.id_guild, id_guild);
    parameters.set(DBM_BirthdayInst.fields.id_user, id_user);
    parameters.set(DBM_BirthdayInst.fields.birthday, birthday);
    parameters.set(DBM_BirthdayInst.fields.label, label);
    // parameters.set(DBM_BirthdayInst.fields.notes, DBConn.conn.escape(notes));
    // needs new escaping
    parameters.set(DBM_BirthdayInst.fields.notes, notes);

    let add_insert = await DB.insert(DBM_BirthdayInst.tableName, parameters);
    return add_insert ? 'BIRTHDAY_ADDED' : 'BIRTHDAY_ERROR';
}

async function initBirthdayReportingInstance(guildId, guild) {
    let birthdayGuildData = await getGuildConfig(guildId);


    if (birthdayGuildData[DBM_BirthdayGuildInst.fields.id_notification_channel] != null) {
        let assignedChannel = birthdayGuildData[DBM_BirthdayGuildInst.fields.id_notification_channel];
        let hour = birthdayGuildData[DBM_BirthdayGuildInst.fields.notification_hour];
        let enabled = parseInt(birthdayGuildData[DBM_BirthdayGuildInst.fields.enabled]) === 1;

        const birthdays = await getListOfBDsForThisServer(guildId);

        if (birthdays.length > 0) {
            let schedule = await schedulerSetup(birthdays, guild, assignedChannel, hour);

            if (enabled) {
                schedule.start();
            }
        }
    }
}

/**
 * Removes the user's birthday from the DB, after checking if there is one at all
 * @param id_guild
 * @param id_user
 * @returns {Promise<string>}
 */
async function removeBirthday(id_guild, id_user) {
    const hasValidBirthday = await doesBirthdayExist(id_guild, id_user);

    if (hasValidBirthday !== null) {
        let parameterWhere = new Map();
        parameterWhere.set(DBM_BirthdayInst.fields.id_guild, id_guild);
        parameterWhere.set(DBM_BirthdayInst.fields.id_user, id_user);
        let deleted = await DB.del(DBM_BirthdayInst.tableName,parameterWhere);

        return deleted ? 'BIRTHDAY_DELETED' : 'BIRTHDAY_ERROR';
    } else {
        return 'NO_BIRTHDAY';
    }
}

module.exports = {
    getGuildConfig,
    initBirthdayReportingInstance,
    addBirthday,
    isGuildEnabled,
    removeBirthday,
    getListOfBDsForThisServer,
    setGuildConfig
};