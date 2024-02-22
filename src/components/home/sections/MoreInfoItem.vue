<template>
  <a-dropdown
    placement="bottomLeft"
    :arrow="{ pointAtCenter: true }"
  >
    <a-button
      type="ghost"
      class="border-0 leading-none group/three-dot p-0 h-3.5 w-3.5 mt-1"
    >
      <IconThreeDot class="group-hover/three-dot:text-[#EE0033] text-[#ABABAB]" />
    </a-button>
    <template #overlay>
      <a-menu>
        <a-menu-item
          @click="onEdit"
          v-if="editTitle"
        >
          <div class="flex items-center my-2 group">
            <IconEditPencil class="mr-3 text-[#BBBBBB] group-hover:text-white" />
            <a-typography-text class="text-[#BBBBBB] font-normal text-xs group-hover:text-white">
              {{ editTitle }}
            </a-typography-text>
          </div>
        </a-menu-item>
        <a-menu-item @click="showConfirm">
          <div class="flex items-center my-2 group">
            <IconTrashNormal class="mr-3 text-[#BBBBBB] group-hover:text-main" />
            <a-typography-text class="text-[#BBBBBB] font-normal text-xs group-hover:text-main">
              {{ deleteTitle }}
            </a-typography-text>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <contextHolder />
</template>

<script setup lang="ts">
import IconTrashNormal from '@/components/icons/home/IconTrashNormal.vue';
import IconEditPencil from '@/components/icons/home/IconEditPencil.vue';
import IconThreeDot from '@/components/icons/IconThreeDot.vue';
const props = defineProps<{
  editTitle?: string;
  deleteTitle: string;
  confirmTxt?: string;
  onEdit?: () => void;
  onDelete: () => void;
}>();
import { Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
const [modal, contextHolder] = Modal.useModal();
const showConfirm = () => {
  modal.confirm({
    title: props.confirmTxt,
    icon: h(ExclamationCircleOutlined),
    onOk: props.onDelete,
    onCancel() {
      console.log('Hủy');
    },
    class: 'test',
    centered: true,
  });
};
</script>

<style scoped></style>
