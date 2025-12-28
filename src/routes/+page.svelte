<script lang="ts">
	import {
		appStore,
		activeBike,
		activeBikeStatus,
		nextServiceInfo,
		garageCount
	} from '$lib/stores';
	import {
		Header,
		ComponentCard,
		ServiceModal,
		AddBikeModal,
		SettingsModal,
		DashboardSummary,
		OdometerModal
	} from '$lib/components';
	import type { BikeComponent } from '$lib/types';
	import type { BikeType } from '$lib/presets';

	// Modal states
	let showAddBikeModal = $state(false);
	let showSettingsModal = $state(false);
	let showOdometerModal = $state(false);
	let showServiceModal = $state(false);
	let selectedComponent = $state<BikeComponent | null>(null);

	// Handlers
	function handleAddBike(
		name: string,
		type: BikeType,
		odometer: number,
		dailyUsage: number,
		freshService: boolean
	) {
		appStore.addBike(name, type, odometer, dailyUsage, freshService);
		showAddBikeModal = false;
	}

	function handleOdometerUpdate(newOdometer: number) {
		if ($activeBike) {
			appStore.updateOdometer($activeBike.id, newOdometer);
		}
		showOdometerModal = false;
	}

	function handleServiceClick(component: BikeComponent) {
		selectedComponent = component;
		showServiceModal = true;
	}

	function handleServiceConfirm(date: string, km: number, notes?: string, cost?: number) {
		if ($activeBike && selectedComponent) {
			appStore.serviceComponent($activeBike.id, selectedComponent.id, date, km, notes, cost);
		}
		showServiceModal = false;
		selectedComponent = null;
	}

	// Sort components by status (danger first, then warning, then safe)
	let sortedStatuses = $derived(
		[...$activeBikeStatus].sort((a, b) => {
			const statusOrder = { danger: 0, warning: 1, safe: 2 };
			return statusOrder[a.status] - statusOrder[b.status];
		})
	);
</script>

<svelte:head>
	<title>MotoMetric - Pencatat Servis Motor</title>
	<meta
		name="description"
		content="Aplikasi pencatat servis motor dengan sistem dual trigger - gabungan KM dan waktu untuk notifikasi yang akurat dan personal."
	/>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<Header
		bikes={$appStore.garage}
		activeBikeId={$appStore.activeBikeId}
		onAddBike={() => (showAddBikeModal = true)}
		onOpenSettings={() => (showSettingsModal = true)}
	/>

	<!-- Main Content -->
	<main class="flex-1 pb-8">
		<div class="max-w-2xl mx-auto px-4 py-6">
			{#if $garageCount === 0}
				<!-- Empty State -->
				<div class="text-center py-16 animate-fade-in">
					<div
						class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center"
					>
						<svg
							class="w-12 h-12 text-orange-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>

					<h2 class="text-2xl font-display font-bold gradient-text mb-2">
						Selamat Datang di MotoMetric!
					</h2>
					<p class="text-dark-500 mb-8 max-w-sm mx-auto">
						Catat servis motor kamu dengan sistem dual trigger - gabungan KM dan waktu untuk
						notifikasi yang akurat.
					</p>

					<button onclick={() => (showAddBikeModal = true)} class="btn btn-primary text-lg px-8">
						<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Tambah Motor Pertama
					</button>

					<!-- Features Preview -->
					<div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
						<div class="card p-4">
							<div
								class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3"
							>
								<svg
									class="w-5 h-5 text-emerald-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 class="font-semibold text-dark-200 mb-1">Dual Trigger</h3>
							<p class="text-sm text-dark-500">KM + Waktu untuk estimasi akurat</p>
						</div>

						<div class="card p-4">
							<div
								class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3"
							>
								<svg
									class="w-5 h-5 text-blue-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<h3 class="font-semibold text-dark-200 mb-1">Multi Motor</h3>
							<p class="text-sm text-dark-500">Kelola beberapa motor sekaligus</p>
						</div>

						<div class="card p-4">
							<div
								class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3"
							>
								<svg
									class="w-5 h-5 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 class="font-semibold text-dark-200 mb-1">Smart Preset</h3>
							<p class="text-sm text-dark-500">Template komponen otomatis</p>
						</div>
					</div>
				</div>
			{:else if $activeBike}
				<!-- Dashboard -->
				<div class="space-y-6 animate-fade-in">
					<!-- Summary Section -->
					<DashboardSummary
						bike={$activeBike}
						nextService={$nextServiceInfo}
						onOdometerEdit={() => (showOdometerModal = true)}
					/>

					<!-- Components List -->
					<div>
						<div class="flex items-center justify-between mb-4">
							<h2 class="text-lg font-semibold text-dark-200">Komponen Motor</h2>
							<span class="text-sm text-dark-500">{$activeBike.components.length} item</span>
						</div>

						<div class="space-y-3">
							{#each sortedStatuses as status (status.component.id)}
								<ComponentCard {status} onService={() => handleServiceClick(status.component)} />
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-dark-800/50 py-4 text-center text-xs text-dark-500">
		<p>MotoMetric © 2025 • Made with ❤️ for Indonesian Riders</p>
	</footer>
</div>

<!-- Modals -->
<AddBikeModal
	isOpen={showAddBikeModal}
	onClose={() => (showAddBikeModal = false)}
	onConfirm={handleAddBike}
/>

<SettingsModal isOpen={showSettingsModal} onClose={() => (showSettingsModal = false)} />

{#if $activeBike}
	<OdometerModal
		isOpen={showOdometerModal}
		currentOdometer={$activeBike.currentOdometer}
		onClose={() => (showOdometerModal = false)}
		onConfirm={handleOdometerUpdate}
	/>
{/if}

{#if selectedComponent && $activeBike}
	<ServiceModal
		isOpen={showServiceModal}
		component={selectedComponent}
		currentOdometer={$activeBike.currentOdometer}
		onClose={() => {
			showServiceModal = false;
			selectedComponent = null;
		}}
		onConfirm={handleServiceConfirm}
	/>
{/if}

<style>
	:global(.light-theme) footer {
		@apply border-dark-200/50;
	}
</style>
