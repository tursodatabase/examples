<script>
	import '../app.postcss';
	import { Logo } from '$lib';
</script>

<nav class="p-2 flex gap-8">
	<a href="/">
		<Logo />
	</a>
	<ul class="flex items-center gap-3">
		<li>
			<a href="/new">New poll</a>
		</li>
		<li>
			<a href="/delete">Delete</a>
		</li>
	</ul>
</nav>

<main class="p-4">
	<slot />
</main>
