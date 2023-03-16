<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import VaultSearchField from '@/components/formElements/VaultSearchField.vue';
// eslint-disable-next-line import/no-cycle
import { deleteFromQuery, deleteExtraQuery, handleQueryOnLoad } from '@/router/utils';

export default {
  components: {
    SectionCard,
    CustomLink,
    InfoMessage,
    VaultSearchField,
  },
  computed: {
    ...mapGetters([
      'searchResults',
    ]),
    ...mapGetters('appearance', [
      'isMobileScreen',
    ]),
    ...mapGetters('lists', [
      'lists',
    ]),
    isTwoColumns() {
      return this.searchResults.lists?.length
        && this.searchResults.items?.length
        && !this.isMobileScreen;
    },
    searchValue() {
      return this.$route.query.searchValue;
    },
  },
  watch: {
    searchValue() {
      this.setSearchResults(null);
      this.searchInVaultAndFindTextOnPage();
    },
  },
  created() {
    const queryOptions = {
      searchValue: {
        callback: this.searchInVaultAndFindTextOnPage,
      },
    };

    handleQueryOnLoad(queryOptions, this.$route.query);
    deleteExtraQuery(queryOptions, this.$route.query);
  },
  beforeUnmount() {
    deleteFromQuery('searchValue');
    this.setSearchResults(null);
  },
  methods: {
    ...mapMutations([
      'setSearchResults',
    ]),
    ...mapActions([
      '_searchInVault',
    ]),
    ...mapActions('lists', [
      '_fetchListsForUser',
      '_setListIdFromLocalStorage',
    ]),
    searchInVaultAndFindTextOnPage() {
      this._searchInVault(this.searchValue);
    },
    highlightResultText(resultUnit) {
      const searchValueLowerCased = this.searchValue.toLowerCase();
      const searchValueLength = this.searchValue.length;
      const htmlWrappers = ['<mark>', '</mark>'];
      const htmlWrappersLength = htmlWrappers.join('').length;

      const initialText = resultUnit;

      if (!resultUnit.toLowerCase().includes(searchValueLowerCased)) {
        return initialText;
      }

      const initialTextLowerCased = initialText.toLowerCase();

      let processedChunksString = '';
      let extraSymbolsCount = 0;

      let startIndex = initialTextLowerCased.indexOf(searchValueLowerCased);
      let endIndex = startIndex + searchValueLength;
      let currentChunk = initialText.slice(0, endIndex);

      while (currentChunk.length >= searchValueLength) {
        const originalCasedFoundText = currentChunk.slice(startIndex, endIndex);
        const newHtmlPiece = htmlWrappers[0] + originalCasedFoundText + htmlWrappers[1];
        const replacedChunk = currentChunk.slice(0, startIndex) + newHtmlPiece;

        processedChunksString += replacedChunk;
        extraSymbolsCount += htmlWrappersLength;

        const newBeginningIndex = processedChunksString.length - extraSymbolsCount;
        const remainingPartLowerCased = initialTextLowerCased.slice(newBeginningIndex);

        startIndex = remainingPartLowerCased.indexOf(searchValueLowerCased);

        if (startIndex === -1) {
          processedChunksString += remainingPartLowerCased;
          break;
        }

        endIndex = startIndex + searchValueLength;
        currentChunk = initialText.slice(newBeginningIndex, newBeginningIndex + endIndex);
      }

      return processedChunksString;
    },
  },
};
</script>

<template>
  <div
    class="search-results"
    :class="`${globalTheme}-theme`"
  >
    <div class="search-input-section">
      <VaultSearchField />
    </div>
    <SectionCard
      title="search results"
      text-style="caps"
    >
      <div
        v-if="searchResults?.lists?.length || searchResults?.items?.length"
        class="results-columns"
        :class="{ 'two-columns' : isTwoColumns }"
      >
        <SectionCard
          v-if="searchResults.items?.length"
          class="result-items"
          title="items"
          size="big"
          text-style="caps"
        >
          <div
            v-for="item in searchResults.items"
            :key="item.id"
          >
            <CustomLink
              class="result-unit"
              :title="highlightResultText(item.title)"
              title-in-html
              :to="{ name: 'list', params: { id: item.listId }, query: { item: item.id } }"
            />
            <div
              v-if="item.details.toLowerCase().includes(searchValue.toLowerCase())"
              class="item-details result-unit"
              v-html="highlightResultText(item.details)"
            />
          </div>
        </SectionCard>
        <SectionCard
          v-if="searchResults.lists?.length"
          class="result-lists"
          title="lists"
          size="big"
          text-style="caps"
        >
          <CustomLink
            v-for="list in searchResults.lists"
            :key="list.id"
            class="result-unit"
            :title="highlightResultText(list.title)"
            title-in-html
            :to="{ name: 'list', params: { id: list.id } }"
          />
        </SectionCard>
      </div>
      <div
        v-else
        class="message"
      >
        <InfoMessage message="nothing matching found in your profile" />
      </div>
    </SectionCard>
  </div>
</template>

<style lang="scss">
.search-results {
  min-height: 100vh;
  padding-top: 90px;

  .search-input-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .results-columns {
    display: grid;

    &.two-columns {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .result-lists,
  .result-items {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 10px 50px 50px;
    color: map-get($colors, 'black');
    font-size: 18px;
  }

  .item-details {
    padding: 10px 0;
    color: map-get($colors, 'gray-dark');
    font-size: 14px;
  }

  .message {
    text-align: center;
  }

  &.inverted-theme {
    .result-lists,
    .result-items {
      color: map-get($colors, 'white');
    }

    .item-details {
      color: map-get($colors, 'gray-light');
    }
  }
}
</style>
