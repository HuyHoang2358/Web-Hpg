<template>
  <div
    class="flex flex-col bg-[#151515] border border-solid rounded-sm border-[#2F2F2F] bg-opacity-90 container-section"
  >
    <HeaderSection
      :on-close="closeDetail"
      :title="detailLayer.title"
    />

    <div class="overflow-auto flex flex-col px-7 pt-4">
      <label class="text-[#EE0033] font-medium text-sm">Tổng quan</label>
      <a-typography-text class="mb-3.5 text-xs text-[#C0C0C0]">
        {{ detailLayer.description }}
      </a-typography-text>
      <label class="text-[#EE0033] font-medium text-sm">Trạng thái</label>
      <a-typography-text class="mb-3.5 text-xs text-[#C0C0C0]">...</a-typography-text>
      <label class="text-[#EE0033] font-medium text-sm">Cập nhật</label>
      <a-typography-text class="mb-3.5 text-xs text-[#C0C0C0]">
        {{ detailLayer.time_create_layer }}
      </a-typography-text>
      <label class="text-[#EE0033] font-medium text-sm">Đơn vị sở hữu</label>
      <a-typography-text class="mb-3.5 text-xs text-[#C0C0C0]">
        {{ detailLayer.layer_provider }}
      </a-typography-text>
      <label class="text-[#EE0033] font-medium text-sm">Chế độ chia sẻ</label>
      <a-typography-text class="mb-3.5 text-xs text-[#C0C0C0]">
        {{ detailLayer.sharing }}
      </a-typography-text>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderSection from '@/components/home/sections/HeaderSection.vue';

defineProps<{
  closeDetail: () => void;
  detailLayer: {
    title: '';
    description: '';
    time_create_layer: '';
    layer_provider: '';
    sharing: '';
  };
}>();
</script>
