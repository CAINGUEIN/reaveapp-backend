# back-project

## Onboarding todo-list :

- Install [MongoDB](https://www.mongodb.com/try/download/community) (v7.0.2 recommended)
- Install [Mongosh](https://www.mongodb.com/try/download/shell) (v2.0.2 recommended)
- Place [.env](https://cdn.discordapp.com/attachments/696115202185232497/1168818368602722304/env?ex=655325ee&is=6540b0ee&hm=893073bc858275a4f2f5d9d974f5d4548ffff4a07abde3ce4d512cf0d9f05c77&) file in the root folder. **Its name has to be ".env"**
- Run "mongosh" in the terminal, and copy "Connecting to:" value. It should look like this:
    ```mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1``` / 'brew services start mongodb/brew/mongodb-community' for mac
- Edit .env file by pasting the value in "MONGOOSE_DB" field.
- Install [Node](https://nodejs.org/en/download) (v18.17.1 recommended)
- Run "npm install" in the root folder / "yarn install" for mac

## Start project

- Run "npm start" in the root folder / "yarn start" for mac