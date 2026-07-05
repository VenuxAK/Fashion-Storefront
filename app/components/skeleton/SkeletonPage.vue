<template>
  <div class="container py-20 animate-pulse space-y-8">
    <div class="space-y-4 text-center">
      <div class="h-8 bg-gray-200 rounded w-64 mx-auto" />
      <div class="h-4 bg-gray-100 rounded w-96 mx-auto" />
    </div>
    <SkeletonProductGrid :count="8" />
  </div>
</template>
