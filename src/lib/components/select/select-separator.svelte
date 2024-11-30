<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';

	type $$Props = SelectPrimitive.SeparatorProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Separator class={'-mx-1 my-1 h-px bg-muted ' + className} {...$$restProps} />
