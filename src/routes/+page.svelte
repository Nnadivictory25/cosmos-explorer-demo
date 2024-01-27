<script lang="ts">
	import type { PageData } from './$types';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { SortAsc, SortDesc } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
    

	type CoinData = {
		id: string;
		symbol: string;
		name: string;
		image: string;
		current_price: number;
		market_cap: number;
		market_cap_rank: number;
		fully_diluted_valuation: number;
		total_volume: number;
		high_24h: number;
		low_24h: number;
		price_change_24h: number;
		price_change_percentage_24h: number;
		market_cap_change_24h: number;
		market_cap_change_percentage_24h: number;
		circulating_supply: number;
		total_supply: number;
		max_supply: number | null;
		ath: number;
		ath_change_percentage: number;
		ath_date: string;
		atl: number;
		atl_change_percentage: number;
		atl_date: string;
		searchTerm: string;
	};

	export let data: PageData;
	let searchTerm: string = '';

	const modifiedCoins: CoinData[] = data.coins.map((coin: CoinData) => ({
		...coin,
		searchTerm: `${coin.id} ${coin.name} ${coin.symbol}`.toLowerCase()
	}));

	let currFilter: string = 'market_cap';
	let sortAsc: boolean = false;

	// $: console.log(sortFilter);

	const filterOptions = [
		{ label: 'Market Cap', value: 'market_cap' },
		{ label: 'Price', value: 'current_price' },
		{ label: 'Name', value: 'name' },
		{ label: 'Price Change (24h)', value: 'market_cap_change_percentage_24h' }
	];

	const formatPercentage = (number: number, decimalPlaces: number = 2) => {
		if (number == null) {
			return '';
		}
		const formattedNumber = number.toFixed(decimalPlaces);

		return number > 0 ? `+${formattedNumber}` : formattedNumber;
	};

	const formatNumber = (number: number | null | undefined) => {
		if (number == null) {
			return '';
		}

		return new Intl.NumberFormat('en-US').format(number);
	};

	const nums = [10, 5, 40, 25, -3412, 4212, -107.578, 97.453];

	function sortNumber(a: number, b: number) {
		return b - a;
	}

	$: filteredCoins = modifiedCoins
		.filter((coin) => coin.searchTerm.includes(searchTerm.toLowerCase()))
		.sort((a, b) => {
			const aValue = a[currFilter as keyof CoinData];
			const bValue = b[currFilter as keyof CoinData];

			if (aValue == null || bValue == null) {
				return 0;
			}

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortAsc ? aValue - bValue : bValue - aValue;
			} else if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortAsc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
			} else {
				// Handle cases where aValue or bValue is not a number or string
				return 0;
			}
		});
</script>

<div class="text-center">
	<img
		class="mx-auto w-40 animate-bounce"
		src="https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png?1696502525"
		alt="cosmos logo"
	/>
	<h1 class="text-2xl font-bold" >Check out the Cosmos Ecosystem !</h1>
	<p>
		Visit <a class="text-blue-500 underline" href="https://cosmos.network">Cosmos.network</a> to learn
		more about cosmos
	</p>

	<h2 class="my-10 text-lg font-bold">
		Coins Data Gotten from <a
			class="text-blue-500 underline"
			href="https://www.coingecko.com/en/api">Coingecko API</a
		>
	</h2>
</div>

<div class="sorters flex w-full flex-wrap items-center gap-5 md:gap-2">
	<div class="flex items-center gap-2">
		<span class="font-semibold">Sorted by:</span>
		<Select.Root
			selected={filterOptions[0]}
			onSelectedChange={(filter) => (currFilter = filter?.value || '')}
		>
			<Select.Trigger class="flex w-[180px]">
				<Select.Value />
			</Select.Trigger>
			<Select.Content>
				{#each filterOptions as filter, i}
					<Select.Item value={filter.value}>{filter.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<p class="font-semibold sm:ml-2">Sort order:</p>
	<Button on:click={() => (sortAsc = !sortAsc)} class="flex items-center gap-3 font-bold">
		{sortAsc ? 'Asc' : 'Desc'}
		{#if sortAsc}
			<SortAsc class="h-4 w-4" />
		{:else}
			<SortDesc class="h-4 w-4" />
		{/if}
	</Button>

	<div class="ml-auto">
		<label for="coin" class="pr-2 font-semibold">Search:</label>
		<input
			bind:value={searchTerm}
			class="rounded-md p-2 text-black outline-none"
			type="search"
			id="coin"
			name="coin"
			placeholder="Search for coin..."
		/>
	</div>
</div>

<div class="mt-12">
	{#if filteredCoins.length === 0}
		<p transition:fade class="text-center font-bold text-red-400 text-lg uppercase">No results found for your search :)</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[20px]">#</Table.Head>
					<Table.Head class="">Coin</Table.Head>
					<Table.Head>Price</Table.Head>
					<Table.Head>24hr</Table.Head>
					<Table.Head class="text-right">Mkt Cap</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredCoins as { id, name, market_cap, image, current_price, price_change_percentage_24h, symbol }, i (id)}
					<Table.Row >
						<Table.Cell class="font-medium">{i + 1}</Table.Cell>
						<Table.Cell class="flex items-center gap-2 font-medium"
							><img class="w-11 rounded-full" src={image} alt="" />
							{name} <span class="text-sm uppercase text-gray-400">{symbol}</span></Table.Cell
						>
						<Table.Cell>{current_price}$</Table.Cell>
						<Table.Cell
							class={` font-medium ${price_change_percentage_24h < 0 ? 'text-red-500' : price_change_percentage_24h > 0 ? 'text-green-500' : ''}`}
							>{formatPercentage(price_change_percentage_24h)}</Table.Cell
						>
						<Table.Cell class="text-right">${formatNumber(market_cap)}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
