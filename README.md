# A Bot Designed to Manage Discord Server Invites

This bot provides an efficient way to track and manage server invites. It includes two main commands: `/invite` and `/reward`.
- **`/invite`**: Check a user's invite count.
- **`/reward`**: Create, delete, or view role-based invite rewards.

<div align='center'>  
    <img src='example/2.png' alt='example1' width='100%'/>  
</div>  

## Features  

✔️ **New Member Notifications** – Announces new members and their inviter in the system channel by default.  
✔️ **Invite Tracking** – Keeps track of each member’s total invites.  
✔️ **Role-Based Rewards** – Create, delete, and view invite-based role rewards.  

---

# Invite Command  

The `/invite` command allows users to check their current number of invites or view another user's invites.  

<div align='center'>  
    <img src='example/3.png' alt='example2' width='100%'/>  
    <img src='example/4.png' alt='example3' width='100%'/>  
</div>  

---

# Reward Command  

## Creating a Reward  

The `/reward create` command is used to set up a new invite-based role reward.  

### Required Parameters:  
- **Role** – The role granted to a member upon reaching the required number of invites.  
- **Invites** – The number of invites needed to earn the reward.  

<div align='center'>  
    <img src='example/5.png' alt='example4' width='300'/>  
    <img src='example/6.png' alt='example5' width='300'/>  
</div>  

Once a role reward is active, the invite card will display the number of invites required to obtain it.  

<div align='center'>  
    <img src='example/7.png' alt='example6' width='300'/>  
    <img src='example/8.png' alt='example7' width='300'/>  
</div>

## Checking Rewards  

The `/reward list` command is used to view all active invite-based role rewards.  

<div align='center'>  
    <img src='example/9.png' alt='example8' width='300'/>  
</div>

## Deleting a Reward  

The `/reward delete` command is used to remove an invite-based role reward.

### Required Parameters:

- **Role** – The role associated with the reward.

<div align='center'>  
    <img src='example/10.png' alt='example9' width='300'/>
    <img src='example/11.png' alt='example10' width='300'/>
</div>

## Installation

### 1. Clone this repository:

```bash
git clone repository.git
cd repository
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create a .env file in the project's root directory with the following content:

```bash
SERVER_HOST=your-server-host
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DATABASE_NAME=your-database-name
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_PORT=your-database-port
DATABASE_PROVIDER=your-database-provider
```

Replace the placeholders with your own values.

### 4. Run the bot:

```bash
npm start
```

## Contributions

Contributions are welcome. If you'd like to contribute, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
