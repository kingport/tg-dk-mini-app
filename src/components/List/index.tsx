import { DotLoading } from 'antd-mobile';
import React, { ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Text, SimpleGrid, Image, Flex, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import EmptyImg from '@/assets/empty.png';

export interface ListPropTypes {
  listItem: Function;
  listData: Array<any>;
  loadMore: any;
  hasMore: boolean;
  className?: string;
  noMoreText?: any;
  display?: 'grid' | 'flex' | 'block' | 'inline' | 'inline-block';
  columns?: number;
  emptyText?: string | ReactNode;
}

const List: React.FC<ListPropTypes> = (props) => {
  const { t } = useTranslation();
  const { listItem, listData, loadMore, hasMore, columns = 2, noMoreText = t('—— No more ——'), display = 'flex', emptyText = t('No record yet') } = props;

  const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <Flex alignItems="flex-end" justifyContent="center" fontSize="xs" color="base">
            <Text>{t('Loading')}</Text>
            <DotLoading color="#ABB3C2" />
          </Flex>
        ) : (
          <>
            {listData?.length > 2 && (
              <Text textAlign="center" fontSize="xs" color="#ABB3C2" my="4">
                {noMoreText}
              </Text>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <InfiniteScroll
      // @ts-ignore
      dataLength={listData?.length || 0}
      next={loadMore}
      hasMore={true}
      className="hiddenScroll"
      style={{ overflow: undefined }}
      // @ts-ignore
      // scrollableTarget={document.body}
      loader={<InfiniteScrollContent hasMore={hasMore} />}
    >
      <Box>
        {display === 'flex' && listData && listData.map((item: any, index) => <React.Fragment key={index}>{listItem(item, index)}</React.Fragment>)}
        {display === 'grid' && (
          <SimpleGrid mt="10px" columns={columns} spacing="14px">
            {listData.map((item: any, index) => {
              return <React.Fragment key={index}>{listItem(item, index)}</React.Fragment>;
            })}
          </SimpleGrid>
        )}

        {!hasMore && listData.length === 0 && (
          <Flex py="60px" flexDirection="column" alignItems="center" justifyContent="center">
            <Image src={EmptyImg} width="140px" height="140px" />
            <Text fontSize="sm" fontWeight="medium" color="#ABB3C2">
              {emptyText}
            </Text>
          </Flex>
        )}
      </Box>
    </InfiniteScroll>
  );
};

export default List;
