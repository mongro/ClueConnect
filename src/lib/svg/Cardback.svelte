<script lang="ts">
	let { colors, back }: { colors: string[]; back?: boolean } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1920 1080">
	<!-- Background -->
	<rect width="100%" height="100%" fill={colors[6]} />

	<!-- Dynamic Waves -->
	<path d="M0,300 Q480,150 960,300 T1920,300 L1920,1080 L0,1080 Z" fill={colors[2]} opacity="0.8" />
	<path
		d="M0,800 Q640,650 1280,800 T2560,800 L2560,1080 L0,1080 Z"
		fill={colors[3]}
		opacity="0.6"
	/>

	<!-- Letters -->
	<text
		x="150"
		y="200"
		font-family="Arial, sans-serif"
		font-size="150"
		fill={colors[0]}
		transform="rotate(-10 150,200)">{back ? 'C' : '?'}</text
	>
	<text
		x="1300"
		y="300"
		font-family="Arial, sans-serif"
		font-size="180"
		fill={colors[1]}
		transform="rotate(5 1300,300)">{back ? 'O' : '?'}</text
	>
	<text
		x="600"
		y="500"
		font-family="Arial, sans-serif"
		font-size="200"
		fill={colors[2]}
		transform="rotate(-15 600,500)">{back ? 'N' : '?'}</text
	>
	<text
		x="1600"
		y="550"
		font-family="Arial, sans-serif"
		font-size="160"
		fill={colors[4]}
		transform="rotate(10 1600,550)">{back ? 'N' : '?'}</text
	>
	<text
		x="900"
		y="850"
		font-family="Arial, sans-serif"
		font-size="240"
		fill={colors[3]}
		transform="rotate(-25 900,850)">{back ? 'E' : '?'}</text
	>
	<text
		x="1200"
		y="1000"
		font-family="Arial, sans-serif"
		font-size="140"
		fill={colors[5]}
		transform="rotate(15 1200,1000)">{back ? 'T' : '?'}</text
	>
	<text
		x="200"
		y="950"
		font-family="Arial, sans-serif"
		font-size="120"
		fill={colors[1]}
		transform="rotate(-5 200,950)">{back ? 'C' : '?'}</text
	>
	<text
		x="1750"
		y="700"
		font-family="Arial, sans-serif"
		font-size="150"
		fill={colors[6]}
		transform="rotate(20 1750,700)">{back ? 'L' : '?'}</text
	>
	<text
		x="1000"
		y="500"
		font-family="Arial, sans-serif"
		font-size="140"
		fill={colors[0]}
		transform="rotate(-10 1000,500)">{back ? 'U' : '?'}</text
	>

	<!-- Border -->
	<rect
		x="20"
		y="20"
		width="1880"
		height="1040"
		fill="none"
		stroke={colors[4]}
		stroke-width="20"
		rx="50"
		ry="50"
	/>
</svg>
