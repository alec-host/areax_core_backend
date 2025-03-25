module.exports.extractInstagramBasicData = (jsonData) => {
    if(jsonData && jsonData._profile_data && jsonData._profile_data.username && jsonData._profile_data.account_type && jsonData._profile_data.media_count){
        const { username, account_type, media_count, followers_count } = jsonData._profile_data;
        return { username, account_type, media_count, followers_count };
    }else{
        throw new Error('Invalid JSON data');
    }
};
