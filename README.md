<div align="center">
    <h1>🍜 Khaopiak</h1>
</div>

An account-less and end-to-end encrypted storage system leveraging Cloudflare Workers with OpenAPI 3.1
using [chanfana](https://github.com/cloudflare/chanfana) and [Hono](https://github.com/honojs/hono).

<hr />

**Source Code**: <a href="https://github.com/Jayson-Fong/khaopiak/">github.com/Jayson-Fong/khaopiak</a>

<hr />

## Purpose

Khaopiak is a temporary, intermediary file storage system for transferring between two devices. It was designed
primarily with printing at hotel business centers in mind, but can cover a range of use cases from file transfers,
viewership verification, and sharing secrets.

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🖨️ Use Case: Printing at hotel business centers</summary>

Hotel business centers often restrict printing to dedicated, shared desktops, resulting in two main options for printing
from a personal device:

<ul>
   <li>Connect personal hardware (ex. USB thumb drives) to shared equipment</li>
   <li>Upload files to a web-based intermediary for download</li>
</ul>

<h3>Personal hardware</h3>

Connecting personal hardware may not always be an option, whether due to port restrictions (such as software
restrictions and the lack of a physical port) or the lack of a physical medium (i.e. cabling or drives). Shared devices
may also harbor malware, stealing files and potentially infecting connected devices.

<h3>Web-based portals</h3>

Logging into web-based portals such as Google Drive, Box, SharePoint, Proton Drive, and Dropbox requires inputting
personal login credentials and grants excessive access to files alongside additional services, such as email. When
passwords are shared, stolen credentials may lead to further compromise, such as enabling logon to financial accounts.

While these web-based services often provide shareable links, they are often too long or complicated to type, such as
this Google Drive share link:

<pre>https://docs.google.com/document/d/t9trB8lKoaB_kIRk6FeFltqm1TGdsCpKolHGwcpVKXPE</pre>

When end-users incorrectly type a character of these URLs, it is often difficult to identify the source of error. To
mitigate this issue, a link shortener can be used; however, it increases the probability of randomly stumbling upon
the document, involves an additional party, and may be predictable.

Shareable links often do not expire, allowing a threat actor to regain access after the initial download, such as
through browser history.

<h3>How Khaopiak helps</h3>

Khaopiak alleviates these issues through enabling the seamless end-to-end encryption of documents accessed through
easily-typed, one-time-use BIP39 mnemonics, such as:

<pre>orchard home picture movie only what believe onion physical defy hole among climb brand million edge anchor upgrade sand awake loop layer panther soda</pre>

This means that end-users need not reference a random character-by-character string, but known words they can quickly
type and remember the spelling of. As all words can be identified using their first three letters, Khaopiak can
automatically correct typos.

During this process, hardware manipulation is not required, users do not need to enter logon credentials besides a
unique, expiring mnemonic, and mnemonics cannot be reused to download the same upload.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🤝 Use Case: Secrets distribution</summary>

Khaopiak can be used to share secrets in an environment where communications integrity is guaranteed; however,
confidentiality is susceptible to compromise, such as communicating vocally in an open office, on the condition that the
secret is not of value immediate value.

This leverages Khaopiak's expiring mnemonics, thus if the intended receiver successfully downloads from the Khaopiak
server, it can be assumed that only they have it. The receiver can then communicate back to the sender to confirm
receipt and use the secret.

If the secret for transmission is of immediate value, two Khaopiak uploads can be used for secure transmission. First,
transmitting a secret of no immediate value: the client-side mnemonic for an intended upcoming transmission. If receipt
is confirmed by the intended recipient, that client-side mnemonic can then be used to encrypt the actual secret
client-side for upload to Khaopiak.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>✅ Use Case: Confirmed file access</summary>

Expiring mnemonics enables confirmed file access through using the Khaopiak server's file existance checking. If
Khaopiak reports that a file exists, it has not yet been downloaded. If it reports that a file does not exist, it
implies that the file has already been downloaded or the file expired.

</details>

## Features

### For end-users

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🔒 End-to-end encryption</summary>

A portion of the mnemonic is never transmitted over the internet and is used to encrypt the file before uploading,
allowing end-to-end encryption. As a result, confidentiality of the original file is protected as it is never made
available to intermediaries.

For all purposes of encryption, Khaopiak uses the Advanced Encryption Standard (AES), with all clients
supporting <a href="https://csrc.nist.gov/pubs/sp/800/38/a/final" target="_blank">Cipher Block Chaining (CBC)</a> and
recommending <a href="https://csrc.nist.gov/pubs/sp/800/38/d/final" target="_blank">Galois/Counter Mode (GCM)</a> when
possible.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>⌛ Expiring files</summary>

By default, all files uploaded to Khaopiak eventually expire. If an attempt is made to an expired file which has not
been deleted from the Khaopiak server, it will be immediately deleted and a response will be returned as if the file did
not exist.

Note: It is possible for a client to assume that a file existed based on the additional processing time required to
check whether the file expired.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🗄️ Protected file metadata</summary>

File names and content types are included as part of the payload for encryption at both the client and server sides. As
a result, at rest, file content cannot be easily inferred.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>📏 Configure mnemonic lengths</summary>

Mnemonics can range from 24 to 48 words where end-users can specify the amount of words for the client and server
independently. As a result, users can choose to increase encryption key lengths for more sensitive files for increased
assurance that data confidentiality is protected.

</details>

### For administrators

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🔑 Restrict access with Cloudflare Access</summary>

Cloudflare Zero Trust customers can optionally require authentication through Cloudflare Access as a self-hosted
application. Khaopiak will check for a `cf-access-authenticated-user-email` header containing a valid email. Cloudflare
prevents impersonating through stripping the header from client requests.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>☁️ Serverless deployment</summary>

Khaopiak is designed for deployment on <a href="https://workers.cloudflare.com/" target="_blank">Cloudflare Workers</a>,
leveraging <a href="https://developers.cloudflare.com/r2/" target="_blank">Cloudflare R2</a> for file storage
and <a href="https://developers.cloudflare.com/queues/" target="_blank">Cloudflare Queues</a> for file expiry, allowing
deployment and automated scaling without having to maintain servers.

</details>

### For all

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>📖 Open source</summary>

Unlike commercially available products, Khaopiak is open source. Organizations and end-users need not go solely based on
product claims, but verify them through analyzing both code and infrastructure design. If a provider hosting a Khaopiak
server cannot be trusted, a private instance can quickly be deployed.

</details>

## Security considerations

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🔐 Cryptographic strength of encryption algorithms</summary>

Khaopiak supports AES-CBC and AES-GCM as they are available through
the <a href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto" target="_blank">SubtleCrypto interface of
the Web Crypto API</a>:

<ul>
   <li><strong>RSA-OAEP</strong> is not supported as it is a public-key encryption system, where current guidelines recommend a minimum of 2048 key bits. To meet this, 192+ BIP39 words would be required, which is unreasonable for an end-user. While client developers may use it for client-side encryption, server-side mnemonic-based encryption/decryption with RSA-OAEP will not be offered.</li>
   <li><strong>AES-CTR</strong> is not supported as it is malleable, potentially allowing the meaning of the ciphertext to be changed.</li>
   <li><strong>AES-CBC</strong> is supported as a client-side encryption algorithm. While Khaopiak is generally not itself vulnerable to a padding oracle attack, client developers should be aware of the algorithm's vulnerability.</li>
   <li><strong>AES-GCM</strong> is supported as both a client and server-side encryption algorithm. AES-GCM provides authenticated encryption which helps authenticate the ciphertext. Additional design considerations are necessary when it is possible for a key and initialization vector (IV) may potentially be reused; however, Khaopiak generates a random key and IV for each upload.</li>
</ul>

The OpenSSL enc program does not support authenticated encryption modes. As a result, some clients may use AES-CBC
instead, such as uploading from the command line.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>💥 Server-side collisions</summary>

Khaopiak does not generate guaranteed unique mnemonics. As a result, it is theoretically possible for a collision to
occur, which may enable accidental file overwriting or downloading of an alternate file. However, this case is extremely
improbable. Client-side encryption helps protect data confidentiality even in the presence of a server-side failure.
While it is possible for another collision, enabling decryption of the file, this is improbable.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🦹 Mnemonic theft</summary>

To conveniently use Khaopiak, the same portal should both accept a server mnemonic and a client mnemonic. However, the
client mnemonic could accidentally be sent to the server if entered incorrectly, compromising end-to-end encryption. A
portal may also be maliciously designed to explicitly capture client mnemonics.

To avoid mnemonic theft, an end-user should have a means of verifying the portal's legitimacy (such as through TLS
certificates). Further, the portal should have a clear means of distinguishing the client and server mnemonics, such as
using half of a combined mnemonic for each, or using a distinct wordlist for the client and server.

</details>

<details style="border: 1px solid; border-radius: 8px; padding: 8px; margin-top: 4px;">
<summary>🧮 User-specified entropy length</summary>

When a user specifies an entropy length of 160 or 224, Khaopiak pads the entropy to become 192 or 256 bits,
respectively, as AES only supports 128, 192, and 256-bit keys. As a result, while a longer-bit algorithm is used for
encryption, it does not inherently increase the level of security assurance as the padding is predictable.

</details>

## To do

- [ ] Configurable content padding to mask content
- [ ] Salt or HMAC object keys
- [ ] POSIX-based upload/download script
- [ ] Web portal
- [ ] Add optional PKI encryption for mnemonic transfers to avoid TLS inspection

## Recommended headers

> [!IMPORTANT]  
> To prevent access issues, including for other applications using the same domain, review headers before setting them.
> You may consider setting them using This may be done
> through [Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/). For
> instance, public installations may consider altering `Clear-Site-Data` to reduce inbound requests. This example will
> be altered at a later date when service workers are supported.

> [!TIP]
> When using [Transform Rules](https://developers.cloudflare.com/rules/transform/response-header-modification/) to set
> the `Access-Control-Allow-Origin` header for multiple sites, consider making it
> dynamically-valued: `http.request.headers["origin"][0]`

```
Access-Control-Allow-Origin: <origin>
Cache-Control: no-store
Clear-Site-Data: "*" 
Content-Security-Policy: default-src 'none'; base-uri 'none'; script-src 'self'; form-action 'self'; script-src-attr 'none'; connect-src 'self'; style-src-elem 'self'; style-src 'self'; style-src-attr 'none'; frame-ancestors 'none'; upgrade-insecure-requests
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
Permissions-Policy: microphone=(), camera=(), geolocation=()
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Vary: Origin
X-Content-Type-Options: nosniff
```

## Examples

### Khaopiak server cURL examples

> [!WARNING]  
> Endpoints that require sending a mnemonic to the server should **only** send server-generated mnemonics, and not ones
> generated locally, which can compromise end-to-end encryption.

#### Uploading files

> [!IMPORTANT]  
> This example does not leverage client-side encryption. Encrypt sensitive files before transmitting them using this
> command.

Request:

```shell
curl -X 'POST' \
  'https://khaopiak/api/file/upload' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/home/username/Desktop/file.pdf' \
  -F 'entropy=128' \
  -F 'expiry=43200'
```

Response:

```json
{
  "success": true,
  "mnemonic": "badge knife trim glimpse solution chaos nasty that quarter angle marine sniff"
}
```

#### Downloading files

> [!NOTE]  
> If the file was encrypted client-side before uploading, this command will not fully decrypt it.

Request:

```shell
curl -X 'POST' \
  'https://khaopiak/api/file/download?noRender=false' \
  -H 'accept: application/octet-stream' \
  -H 'Content-Type: multipart/form-data' \
  -F 'mnemonic=badge knife trim glimpse solution chaos nasty that quarter angle marine sniff' \
  --output "/home/username/Desktop/file.pdf"
```

#### Checking if files exist

Request:

```shell
curl -X 'POST' \
  'https://khaopiak/api/file/exists' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'mnemonic=badge knife trim glimpse solution chaos nasty that quarter angle marine sniff'
```

Response:

```shell
{
  "success": true,
  "exists": true
}
```

#### Deleting a file

Request:

```shell
curl -X 'POST' \
  'https://khaopiak/api/file/delete' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'mnemonic=badge knife trim glimpse solution chaos nasty that quarter angle marine sniff'
```

Response:

```json
{
  "success": true
}
```

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler r2 bucket create khaopiak` to create a Cloudflare R2 bucket
5. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:8787/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the
   Swagger interface.
