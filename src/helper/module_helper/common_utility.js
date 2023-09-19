const userAddressDao = require('../../modules/user_address/userAddressDao');

const removeIsDefaultAddress = async (user_id) => {
    try {
        const customObj = {
            is_default: false
        }
        const [count, update] = await userAddressDao.updateByUserId(user_id, customObj);
        return update;
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
}

module.exports = {
    removeIsDefaultAddress
}