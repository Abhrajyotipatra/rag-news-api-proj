// Simple in-memory vector store instead of Chroma

class VectorDbService {
  constructor() {
    this.collectionName = 'news_articles';
    this.documents = []; // { id, title, content, source, embedding }
  }

  async initializeCollection() {
    console.log('In-memory vector store initialized');
  }

  async addDocuments(documents) {
    // documents: [{ title, content, source, embedding }]
    const ids = documents.map((_, i) => `doc_${Date.now()}_${i}`);

    documents.forEach((doc, idx) => {
      this.documents.push({
        id: ids[idx],
        title: doc.title,
        content: doc.content,
        source: doc.source,
        embedding: doc.embedding,
      });
    });

    console.log(`Stored ${ids.length} documents in memory`);
    return ids;
  }

  // cosine similarity between two vectors
  _cosineSim(a, b) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }
    if (!na || !nb) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  async queryDocuments(queryEmbedding, topK = 5) {
    if (!this.documents.length) return [];

    const scored = this.documents.map(doc => ({
      doc,
      score: this._cosineSim(queryEmbedding, doc.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(item => ({
      title: item.doc.title,
      content: item.doc.content,
      source: item.doc.source,
      distance: 1 - item.score,
    }));
  }

  async deleteCollection() {
    this.documents = [];
    console.log('In-memory collection cleared');
  }
}

module.exports = new VectorDbService();
