import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async () => {
    async function getCoins() {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=cosmos-ecosystem&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=CG-CM71sa8LaFkGwEXibcBXZzqB')
        console.log(res.status, res.statusText)
        const contentType = res.headers.get("Content-Type");
        if (contentType && contentType.startsWith("text/html")) {
            console.log("Response is HTML");
            const htmlResponse = await res.text();
            console.log(htmlResponse);
            
            return; 
        }
        const data = await res.json()

        return data;
    }


    return {
        coins: await getCoins()
    }
}