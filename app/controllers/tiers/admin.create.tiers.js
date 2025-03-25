const { db } = require("../../models");

const Tiers = db.tiers;
const Users = db.users;

module.exports.createSubscriptionTiers = (newTier) => {
    return new Promise((resolve, reject) => {
        Tiers.create(newTier).then(() => {
            resolve([true,'New subscription tier has been created.']);
        }).catch(err => {
            console.log(err);
            resolve([false,'Error occurred, Failed to create a new tier entry.']);
        });
    });
};

module.exports.getSubscriptionTiersByReferenceNumber = async(callBack) => {
    await Tiers.findAll({attributes: ['reference_number','name','monthly_cost','yearly_cost','campaign_specific_price','entry','benefits','credits_per_action','is_deleted'],}).then((data) => {
        callBack(data);
    }).catch(e => {
        console.error(e);
        callBack([]);
    });
};

module.exports.getSubscriptionTierByReferenceNumber = async(reference_number,callBack) => {
    await Tiers.findAll({attributes: ['reference_number','name','monthly_cost','yearly_cost','campaign_specific_price','entry','benefits','credits_per_action','is_deleted'],
    where:{reference_number:reference_number}}).then((data) => {
        callBack(data);
    }).catch(e => {
        console.error(e);
        callBack([]);
    });
};

module.exports.getSubscriptionTierByName = async(name,callBack) => {
    await Tiers.findAll({attributes: ['reference_number','name','monthly_cost','yearly_cost','campaign_specific_price','entry','benefits','credits_per_action','is_deleted'],
    where:{name:name}}).then((data) => {
        callBack(data);
    }).catch(e => {
        console.error(e);
        callBack([]);
    });
};

module.exports.updateSubscriptionTiersByReferenceNumber = async(reference_number,payload) => {
    const isUpdated = await Tiers.update(payload,{ where:{ reference_number: reference_number } }).catch(e => { return false; });
    console.log(isUpdated);	
    if(!isUpdated || !isUpdated[0]){
        return false;
    }
    return true;
};

module.exports.deleteSubscriptionTiersByReferenceNumber = async(reference_number) => {
    const isDeleted = await Tiers.destroy({ where: { reference_number: reference_number } }).catch(e => { return false; });
    if(isDeleted === 0){
        return false;
    }
    return true;
};

module.exports.addSubscriptionPlanByReferenceNumber = async(reference_number,payload) => {
    const isUpdated = await Users.update(payload,{ where: { reference_number: reference_number } }).catch(e => { return false; });
    if(!isUpdated || !isUpdated[0]){
        return false;
    }
    return true;
};

module.exports.userSubscriptionPlanByReferenceNumber = async(reference_number,payload) => {
    await Users.findAll({attributes: ['tier_reference_number'],
    where:{reference_number:reference_number}}).then((data) => {
        callBack(data);
    }).catch(e => {
        console.error(e);
        callBack([]);
    });	
};
