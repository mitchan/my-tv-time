import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_PATH = 'https://www.imdb.com';

type FilmLink = {
    text: string;
    href: string;
};

export async function loadTop(): Promise<void> {
    const { data } = await axios.get(`${BASE_PATH}/chart/top/`);

    const $ = cheerio.load(data);

    const links: FilmLink[] = [];
    $('td.titleColumn a').each((i, el) => {
        const data = getData($, el);
        links.push(data);
    });

    console.log(links.length);
}

function getData($: cheerio.CheerioAPI, el: cheerio.Element): FilmLink {
    const href = $(el).attr('href');
    const text = $(el).text();

    if (!href) {
        throw new Error(`Cannot find href for ${el}`);
    }

    return { href, text };
}
