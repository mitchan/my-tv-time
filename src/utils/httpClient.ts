import * as https from 'https';

export class HttpClient {
    constructor() {}

    get(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            https
                .get(url, (response) => {
                    if (typeof response.statusCode !== 'number') {
                        reject(`Got an invalid code while getting ${url}`);
                        return;
                    }

                    let str = '';

                    //another chunk of data has been received, so append it to `str`
                    response.on('data', function (chunk) {
                        str += chunk;
                    });

                    //the whole response has been received, so we just print it out here
                    response.on('end', function () {
                        resolve(str);
                    });
                })
                .end();
        });
    }
}
