const fs = require('node:fs');
const { setTimeout } = require('node:timers/promises');
const beautify = require('js-beautify').js_beautify;

const SETTINGS = {
    PACKAGE_FILEPATH: '.\\Discord\\messages',
    FLAGGING_REGEX: new RegExp(),
    ATTACHMENTS_OUTPUT_DIRECTORY: '.\\src\\attachments',
    DATABASE_TEMP: {

    }
}

async function UserInfo(user_id) {
    let userInfo = (await fetch(`https://discordlookup.mesalytic.moe/v1/user/${user_id}`)).json();
    return userInfo;
}

async function CreateIDDatabase(overwrite = false) {
    let directory = fs.readdirSync(SETTINGS.PACKAGE_FILEPATH);
    let ids = [];
    for (let channel_id of directory) {
        if (!channel_id.match('\\.json')) { //ignore the .json file
            let channel = JSON.parse(fs.readFileSync(`${SETTINGS.PACKAGE_FILEPATH}\\${channel_id}\\channel.json`, { encoding: 'utf-8' }));
            let messages = JSON.parse(fs.readFileSync(`${SETTINGS.PACKAGE_FILEPATH}\\${channel_id}\\messages.json`, { encoding: 'utf-8' }));

            channel.recipients?.forEach(id => {
                !!id && id != 'Deleted User' && !ids.includes(id) && ids.push(id);
            });
        }
    }
    SETTINGS.DATABASE_TEMP = JSON.parse(fs.readFileSync('.\\src\\databases\\user_lookup.json', { encoding: 'utf-8' }));
    for (let id of ids) {
        if (Object.keys(SETTINGS.DATABASE_TEMP).includes(id) && !overwrite) {
            console.log('This user is already cached.');
            continue;
        }
        await setTimeout(1000);
        console.log(`Fetching ${id}'s info...`);
        let userInfo = await UserInfo(id);
        userInfo?.message && console.log(userInfo.message);
        SETTINGS.DATABASE_TEMP[id] = {
            avatar: userInfo.avatar.link,
            global_name: userInfo.global_name,
            username: userInfo.username
        };
        console.log('Done.')
    }
    fs.writeFileSync('.\\src\\databases\\user_lookup.json', beautify(JSON.stringify(SETTINGS.DATABASE_TEMP)));
    //organize by username, alphabetical, perhaps add a feature to track 
}

async function TextStripper() {
    let directory = fs.readdirSync(SETTINGS.PACKAGE_FILEPATH);
    let ids = [];
    for (let channel_id of directory) {
        if (!channel_id.match('\\.json')) { //ignore the .json file
            let channel = JSON.parse(fs.readFileSync(`${SETTINGS.PACKAGE_FILEPATH}\\${channel_id}\\channel.json`, { encoding: 'utf-8' }));
            let messages = JSON.parse(fs.readFileSync(`${SETTINGS.PACKAGE_FILEPATH}\\${channel_id}\\messages.json`, { encoding: 'utf-8' }));

        }
    }
    console.log(ids);
}

async function AttachmentDownloader(channel_json) {
    /*
    await fetch(attachment)
    fs.write (.\\channel_id\\attachment_name)
    await HumanDelay();
    */
}

async function MessageDeleter(messages) { //not my fault if you get banned for self-botting
    /*
    for(message of messages){
        <delete message fetch>
        console.log(await HumanDelay());
    }
    */
    //make sure to add the deleted: true kvp to any messages that you delete, and check for messages[i]?.deleted
}

function RandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

async function HumanDelay(min = 2, max = 5) {
    let seconds = RandomNumber(min, max);
    return setTimeout(seconds * 1000, `Waiting ${seconds} seconds...`)
}

for (let i = 0; i < 1000; i++) {
    HumanDelay(3, 4);
}