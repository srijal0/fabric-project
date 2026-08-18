from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def create_fabric_text(fabric):
    return (
        f"{fabric.name}. "
        f"Category: {fabric.category}. "
        f"Composition: {fabric.composition}. "
        f"Color: {fabric.color_name}. "
        f"Pattern: {fabric.pattern}. "
        f"Weight: {fabric.weight_gsm} GSM. "
        f"Usage: {fabric.usage}. "
        f"Season: {fabric.season}. "
        f"Care: {fabric.care}. "
        f"Supplier: {fabric.supplier}."
    )


def find_similar_fabrics(target_fabric, fabrics, top_k=5):
    if not fabrics:
        return []

    target_text = create_fabric_text(target_fabric)
    target_embedding = model.encode([target_text])

    other_fabrics = [
        fabric for fabric in fabrics
        if fabric.id != target_fabric.id
    ]

    if not other_fabrics:
        return []

    texts = [create_fabric_text(fabric) for fabric in other_fabrics]
    embeddings = model.encode(texts)

    similarities = cosine_similarity(
        target_embedding,
        embeddings
    )[0]

    results = []

    for fabric, score in zip(other_fabrics, similarities):
        results.append({
            "fabric": fabric,
            "similarity": float(score)
        })

    results.sort(
        key=lambda item: item["similarity"],
        reverse=True
    )

    return results[:top_k]