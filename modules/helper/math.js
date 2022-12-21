function calculatePercentage(original_value, percentage) {
	return Math.round(original_value * (percentage / 100));
}

function calculateAddPercentage(original_value, percentage) {
	return original_value + Math.round(original_value * (percentage / 100));
}

module.exports = { calculatePercentage, calculateAddPercentage };