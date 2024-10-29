## https://www.quicknode.com/guides/solana-development/spl-tokens/how-to-transfer-spl-tokens-on-solana

## SPL Token Mint ID 可以理解为币种的唯一标识符，它是一个 32 字节的数组，可以通过 SPL Token Mint ID 来获取对应的 Token Mint Address。


## ATA 账户 The Solana Token Program derives "a token account key from a user's main System account address and a token mint address, allowing the user to create a main token account for each token they own" (Source: spl.solana.com). That account is referred to as an Associated Token Account or "ATA." Effectively an ATA is a unique account linked to a user and a specific token mint. For example, let's say I am the owner of Account "DEMO...1234". I can have many ATAs--one for each token mint I hold (e.g., a unique ATA for each $USDC, $SAMO, etc., as illustrated below).

## ATA 账户是通过用户的主 System 账户地址和 Token Mint 地址派生出来的，允许用户为他们拥有的每个 Token 创建一个主 Token 账户。这个账户被称为关联 Token 账户或 "ATA"。实际上，ATA 是一个与用户和特定 Token Mint 相关联的唯一账户。例如，假设我是账户 "DEMO...1234" 的所有者。我可以拥有许多 ATA，每个 Token Mint 一个（例如，每个 $USDC、$SAMO 等的唯一 ATA，如下图所示）。


```
As you'll see in our code in a bit, every account does not already have an ATA for every mint. If a user hasn't interacted with a token before, the sender must "create" it and deposit the necessary rent for the account to remain active.

This concept can be tricky at first, but it's important, so take the time to ensure you understand this! I find it helpful to browse my wallet on Solana Explorer on the tokens detail page: https://explorer.solana.com/address/YOUR_WALLET_ADDRESS/tokens?display=detail. You can see each of your ATAs, their Account ID, and the associated Mint ID:
```

## 如您稍后在我们的代码中看到的，每个账户并没有为每个铸币厂都有一个 ATA。如果用户以前没有与 Token 交互过，发送方必须“创建”它并存入账户保持活动所需的租金。

## https://www.quicknode.com/guides/solana-development/spl-tokens/how-to-transfer-spl-tokens-on-solana 翻译下这个网站的内容

