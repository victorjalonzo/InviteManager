# A bot designed to manage Discord server invites and role-based rewards.

This bot provides an intuitive solution for tracking invites and managing role-based rewards on your Discord server. It simplifies rewarding users for invites with a flexible system, allowing admins to easily monitor activity and incentivize community growth.

Key features include two main commands:

/invite: View a user's invite count to track their contributions.

/reward: Manage role-based rewards, allowing admins to assign or remove rewards based on invite milestones.

<div align='center'>  
    <img src='example/2.png' alt='example1' width='100%'/>  
</div>  

## Features  

✔️ **New Member Notifications** – Announces new members and their inviter in the system channel by default.  
✔️ **Invite Tracking** – Keeps track of each member’s total invites.  
✔️ **Role-Based Rewards** – Create, delete, and view invite-based role rewards.  

---

# Member Join Notification

The bot will send a notification to the system channel when a new member joins the server. The notification includes the member's username and their inviter's username.

<div align='center'>  
    <img src='example/1.png' alt='example' width='100%'/>  
</div>

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
    <img src='example/5.png' alt='example4' width='100%'/>  
    <img src='example/6.png' alt='example5' width='100%'/>  
</div>  

Once a role reward is active, the invite card will display the number of invites required to obtain it.  

<div align='center'>  
    <img src='example/7.png' alt='example6' width='100%'/>  
    <img src='example/8.png' alt='example7' width='100%'/>  
</div>

## Checking Rewards  

The `/reward list` command is used to view all active invite-based role rewards.  

<div align='center'>  
    <img src='example/9.png' alt='example8' width='100%'/>  
</div>

## Deleting a Reward  

The `/reward delete` command is used to remove an invite-based role reward.

### Required Parameters:

- **Role** – The role associated with the reward.

<div align='center'>  
    <img src='example/10.png' alt='example9' width='100%'/>
    <img src='example/11.png' alt='example10' width='100%'/>
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
