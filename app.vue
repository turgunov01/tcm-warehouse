<template>
  <ClientOnly>
    <AppPulseCursor />
  </ClientOnly>

  <NuxtLayout>
    <NuxtPage :transition="{ name: 'app-page', mode: 'out-in' }" />
  </NuxtLayout>
</template>
