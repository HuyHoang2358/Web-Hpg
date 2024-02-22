<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    row-class-name="cursor-pointer"
    @change="handleTableChange"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="16">
          <h1 class="text-3xl mb-1">Danh sách nhật ký hệ thống</h1>
        </a-col>
        <a-col :span="8">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import { computed, ref, watch } from 'vue';
import { useLogs } from '@/services/hooks/useSystem';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import type { LogResType } from '@/services/apis/systemApi';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const searchValue = ref<string>('');
const direction = ref<string>('');
const sort = ref<string>('');
const userIds = ref<string[]>();

const { data, isLoading } = useLogs({
  searchValue: searchValue,
  sort: sort,
  direction: direction,
  userIds: userIds,
});

const dataSource: ComputedRef<LogResType[]> = computed(() => data?.value?.data || []);

watch(searchValue, () => {
  router.replace({
    query: {
      searchValue: searchValue.value || undefined,
    },
  });
});

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: any,
  sorter: any,
) => {
  userIds.value = filters?.name;
  sort.value = sorter.field;
  direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';
};

const getUserFilterData = () => {
  const dataLogs = data?.value?.data || [];
  const uniqueUserIds = [...new Set(dataLogs.map((i) => i.userId) || [])];
  return uniqueUserIds.map((i) => {
    const el = dataLogs.find((item) => item.userId === i);
    return { text: el?.name, value: el?.userId };
  });
};
const columns = computed(() => [
  {
    title: 'STT',
    width: 80,
    align: 'center',
  },
  {
    title: 'Thời gian',
    dataIndex: 'createdDate',
    sorter: true,
  },
  {
    title: 'Người tác động',
    dataIndex: 'name',
    filters: getUserFilterData(),
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    sorter: true,
  },
]);
</script>
