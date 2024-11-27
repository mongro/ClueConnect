import { Dialog as DialogPrimitive } from 'bits-ui';

import Title from './dialog-title.svelte';
import Portal from './dialog-portal.svelte';
import Overlay from './dialog-overlay.svelte';
import Content from './dialog-content.svelte';

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;

export {
	Root,
	Title,
	Portal,
	Trigger,
	Overlay,
	Content,
	Close,
	//
	Root as Dialog,
	Title as DialogTitle,
	Portal as DialogPortal,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Close as DialogClose
};
