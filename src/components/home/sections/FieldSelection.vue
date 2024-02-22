<template>
  <div class="flex flex-row">
    <button
      @click="show = !show"
      class="cursor-pointer flex flex-col bg-[#212121] bg-opacity-90 p-2 pb-0 border border-solid border-[#787878] rounded-md group"
    >
      <img
        src="/images/home/field.png"
        :alt="title"
        class="img-field"
      />
      <a-typography-text
        style="width: 52px"
        :ellipsis="{ tooltip: title }"
        :content="title"
        class="text-[10px] h-4 group-hover:text-main"
      />
    </button>
    <div class="overflow-hidden flex">
      <Transition name="slide-fade">
        <div
          class="flex flex-row items-start bg-[#212121] bg-opacity-90 p-2 pb-0 rounded ml-1"
          v-if="show"
        >
          <button
            v-for="item in listFields"
            :key="item.id"
            :class="[
              'text-xs font-medium px-0 border-none uppercase bg-[#212121] bg-opacity-90 w-14 mr-2.5 cursor-pointer group',
            ]"
            @click="onSelectUnit(item)"
          >
            <img
              src="/images/home/field.png"
              :alt="item.name"
              class="img-field"
            />
            <a-typography-text
              style="width: 52px"
              :ellipsis="{ tooltip: item.name }"
              :content="item.name"
              :class="[
                'line-clamp-1 text-[10px] h-3 group-hover:text-main normal-case',
                mapToolStore.selectedUnit === item.id ? 'text-[#D0002D]' : 'text-[#717171]',
              ]"
            />
          </button>
          <div class="flex flex-col justify-center h-full">
            <a-button
              type="ghost"
              class="w-2 px-0 cursor-pointer -ml-1"
              @click="show = false"
            >
              <IconExpandField class="rotate-180" />
            </a-button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCategoriesInUnit } from '@/services/hooks/useLayer';
import { GROUP_LAYER_TYPE } from '@/utils/enums';
import type { ComputedRef } from 'vue';
import type { CategoryResType } from '@/services/apis/layer';
import { useConfigStore } from '@/stores/config';
import IconExpandField from '@/components/icons/home/IconExpandField.vue';
import { useMapToolStore } from '@/stores/mapTool';
import { useI18n } from 'vue-i18n';

const show = ref(false);
const configStore = useConfigStore();
const mapToolStore = useMapToolStore();

let isFirstSetValue = false;

watch(
  () => configStore.profile?.units,
  () => {
    if (!isFirstSetValue && configStore.profile?.units && configStore.profile?.units.length !== 0) {
      isFirstSetValue = true;
      mapToolStore.selectedUnit = configStore.profile?.units[0].id;
    }
  },
);

const onSelectUnit = (item: CategoryResType) => {
  show.value = false;
  mapToolStore.selectedUnit = item.id;
};

const { data: fields } = useCategoriesInUnit(GROUP_LAYER_TYPE.CHUYEN_NGANH);

const listFields: ComputedRef<CategoryResType[]> = computed(() => fields?.value?.data || []);

const { t } = useI18n();

const title = computed(() =>
  mapToolStore.selectedUnit
    ? listFields.value?.find((item) => item.id === mapToolStore.selectedUnit)?.name ||
      t('home.mapTool.field')
    : t('home.mapTool.field'),
);
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-420px);
  opacity: 0;
}

.img-field {
  width: 52px;
  height: 43px;
}
</style>
