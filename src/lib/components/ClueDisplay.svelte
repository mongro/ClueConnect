<script lang="ts">
	import type { Team } from '$shared/src/types';
	import { quartInOut } from 'svelte/easing';

	function moveScale(node: Element, { duration = 200, startScale = 1.5 }) {
		return {
			duration,
			delay: 4000,
			css: (t: number) => {
				const eased = quartInOut(t);
				return `transform: scale(${startScale - eased * 0.5}) translateY(-${(1 - eased) * 200}px)`;
			}
		};
	}

	interface Props {
		clue: string;
		number: number;
		team: Team;
	}
	let { clue, number, team }: Props = $props();
</script>

<div
	in:moveScale={{ duration: 1500 }}
	class="text-primary-foreground flex items-center justify-center gap-4 text-xl"
>
	<div
		class="text-bold rounded bg-white p-2 uppercase ring-4"
		class:ring-red-card={team === 'red'}
		class:ring-blue-card={team === 'blue'}
	>
		{clue}
	</div>
	<div
		class="text-bold rounded bg-white p-2 ring-4"
		class:ring-red-card={team === 'red'}
		class:ring-blue-card={team === 'blue'}
	>
		{number}
	</div>
</div>
