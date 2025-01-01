import {html} from 'hono/html';

export const Content = () =>
    html`
        <html lang="en-US">
        <body>
        <main>
            <h1>Khaopiak</h1>
            <p>
                Hi there! This service is still under heavy development, so
                use this for experimental purposes only! In fact, this may
                even go poof! While you can download files through this
                interface, you'll need your own solutions all other
                operations (deleting without downloading, existence
                checking, uploading).
            </p>
            <p>
                Using the raw API, all files uploaded (including their name
                and content type) are encrypted at rest in Cloudflare R2 and
                is retrievable using a
                <a
                        href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki"
                        target="_blank"
                >BIP39 mnemonic</a
                >.
            </p>
            <p>
                Ideally, you, the client, should also have your own private
                BIP39 mnemonic for client-side encryption, eventually to be
                integrated into this application!
            </p>
            <p>
                Check out the
                <a href="/api" target="_blank">SwaggerUI page</a>! While
                you're at it,
                <a
                        href="https://github.com/Jayson-Fong/khaopiak"
                        target="_blank"
                >contribute</a
                >?
            </p>
            <h2>Download File</h2>
            <form method="POST" action="/api/file/download" target="_blank">
                <label for="mnemonic">Mnemonic</label>
                <textarea id="mnemonic" name="mnemonic" rows="4"></textarea>
                <p>
                    Please note that using this form will automatically
                    render any PDF-ey looking files in your browser! All
                    others will be happily downloaded, though.
                </p>
                <input type="submit"/>
            </form>
            <p>
                To help you get started, here's a sample cURL request to
                upload a file:
            </p>
            <pre><code>
   curl -X 'POST' \\
        'https://khaopiak.jayson-fong.workers.dev/api/file/upload' \\
        -H 'accept: application/json' \\
        -H 'Content-Type: multipart/form-data' \\
        -F 'file=@/home/username/Desktop/file.pdf' \\
        -F 'entropy=128' \\
        -F 'expiry=43200'
            </code></pre>
            <p>Because AES-GCM is used, while you may specify 128, 160, 192, 224, or 256 bits for your BIP39, the
                server-side encryption will only use 128, 192, or 256 bits, where the highest possible key length is
                chosen.</p>
            <p>File expiry may be between 1 - 4,320,000 seconds, based on the limits for <a
                    href="https://developers.cloudflare.com/queues/" target="_blank">Cloudflare Queues</a> message
                retries (while this
                can be worked around, really?)</p>
        </main>
        </body>
        </html>`;
