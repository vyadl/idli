<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import SectionCard from '@/components/wrappers/SectionCard.vue';
import CustomLink from '@/components/wrappers/CustomLink.vue';
import InfoMessage from '@/components/textElements/InfoMessage.vue';
import { deleteFromQuery, deleteExtraQuery, handleQueryOnLoad } from '@/router/utils';

export default {
  components: {
    SectionCard,
    CustomLink,
    InfoMessage,
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
      this.searchVaultAndFindTextOnPage();
    },
  },
  created() {
    if (!this.lists?.length) {
      this._fetchListsForUser();
    }

    const queryOptions = {
      searchValue: {
        callback: this.searchVaultAndFindTextOnPage,
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
      '_searchVault',
    ]),
    ...mapActions('lists', [
      '_fetchListsForUser',
      '_setListIdFromLocalStorage',
    ]),
    searchVaultAndFindTextOnPage() {
      this._searchVault(this.searchValue)
        .then(() => {
          this.highlightResultText();
        });
    },
    highlightResultText() {
      const resultUnits = document.querySelectorAll('.result-unit');
      const searchValueLowerCased = this.searchValue.toLowerCase();
      const searchValueLength = this.searchValue.length;
      const searchValueRegex = new RegExp(`${this.searchValue}`, 'ig');

      resultUnits.forEach(unit => {
        if (unit.innerText.toLowerCase().includes(searchValueLowerCased)) {
          const initialHTML = unit.innerHTML;
          const initialHTMLLowerCased = unit.innerHTML.toLowerCase();

          const processedChunks = [];

          let firstIndex = initialHTMLLowerCased.indexOf(searchValueLowerCased);
          let lastIndex = firstIndex + searchValueLength;
          let currentChunk = initialHTML.slice(0, lastIndex);

          while (currentChunk.length >= searchValueLength) {
            const originalCasedText = currentChunk.slice(firstIndex, lastIndex);
            const newHTMLPiece = `<mark>${originalCasedText}</mark>`;
            
            const replacedChunk = currentChunk.replace(searchValueRegex, newHTMLPiece);

            processedChunks.push(replacedChunk);

            const extraSymbolsCount = (newHTMLPiece.length - originalCasedText.length)
              * processedChunks.length;
            const processedChunksLength = processedChunks.join('').length;
            const newBeginningIndex = processedChunksLength - extraSymbolsCount;

            const remainingPart = initialHTMLLowerCased.slice(newBeginningIndex);

            firstIndex = remainingPart.indexOf(searchValueLowerCased);
            lastIndex = firstIndex + searchValueLength;

            currentChunk = initialHTML.slice(newBeginningIndex, newBeginningIndex + lastIndex);

            if (firstIndex === -1) {
              processedChunks.push(remainingPart);
              currentChunk = '';
            }
          }

          unit.innerHTML = processedChunks.join('');
        }
      });
    },
  },
};
</script>

<template>
  <div
    class="search-results"
    :class="`${globalTheme}-theme`"
  >
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
              :title="item.title"
              :to="{ name: 'item', params: { id: item.id } }"
            />
            <div
              v-if="item.details.includes(searchValue)"
              class="item-details result-unit"
            >
              {{ item.details }}
            </div>
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
            :title="list.title"
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
    padding: 10px 70px 50px;
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
