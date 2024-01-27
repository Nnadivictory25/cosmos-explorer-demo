import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ params }) => {
    async function getCoins() {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=cosmos-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_api_key=CG-CM71sa8LaFkGwEXibcBXZzqB')
        const data = await res.json()
        
        return data;
    }


    return {
        coins: await getCoins()
    }
}