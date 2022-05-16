const validatePhoneNumber = (phoneNumber) => {
	return /^\d{2,3}-\d+$/.test(phoneNumber)
}

const Utils = {
	validatePhoneNumber
}

module.exports = Utils