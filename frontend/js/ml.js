// ============================================================
// Selvage ML - Similar Fabric Recommendations
// ============================================================

async function loadSimilarFabrics(fabricId) {
    const container = document.getElementById("similarFabrics");

    if (!container) {
        console.error("similarFabrics container not found");
        return;
    }

    container.innerHTML = `
        <div class="similar-loading">
            Finding similar fabrics...
        </div>
    `;

    try {
        const response = await fetch(
            `${API_BASE}/fabrics/${fabricId}/similar`
        );

        if (!response.ok) {
            throw new Error(`ML request failed: ${response.status}`);
        }

        const data = await response.json();

        renderSimilarFabrics(data);

    } catch (error) {
        console.error("ML recommendation error:", error);

        container.innerHTML = `
            <div class="similar-error">
                Unable to load similar fabrics.
                <br>
                <small>
                    Make sure the ML service and backend are running.
                </small>
            </div>
        `;
    }
}


function renderSimilarFabrics(data) {
    const container = document.getElementById("similarFabrics");

    if (!container) {
        return;
    }

    const recommendations = data.recommendations || [];

    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="similar-empty">
                No similar fabrics found.
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="similar-header">
            <div>
                <h3>Similar Fabrics</h3>
                <p>
                    ML-powered recommendations based on fabric
                    characteristics and semantic similarity.
                </p>
            </div>
            <span class="ml-badge">ML</span>
        </div>

        <div class="similar-grid">
            ${recommendations.map(fabric => {

                const score = Number(fabric.similarity_score || 0);

                const percentage = Math.round(score * 100);

                return `
                    <div
                        class="similar-card"
                        data-fabric-id="${fabric.id}"
                    >
                        <div class="similar-card-top">
                            <div>
                                <h4>${escapeHtml(fabric.name)}</h4>

                                <div class="similar-sku">
                                    ${escapeHtml(fabric.sku || "")}
                                </div>
                            </div>

                            <div class="similar-score">
                                ${percentage}%
                            </div>
                        </div>

                        <div class="similar-info">
                            <span>
                                ${escapeHtml(fabric.category || "Unknown")}
                            </span>

                            <span>
                                ${escapeHtml(fabric.composition || "—")}
                            </span>
                        </div>

                        <div class="similar-score-bar">
                            <div
                                class="similar-score-fill"
                                style="width:${Math.min(
                                    percentage,
                                    100
                                )}%"
                            ></div>
                        </div>

                        <div class="similar-score-label">
                            Similarity score:
                            ${score.toFixed(4)}
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `;

    // Allow clicking a recommendation to open its details.
    container
        .querySelectorAll(".similar-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                const id = Number(
                    card.getAttribute("data-fabric-id")
                );

                if (id) {
                    openDetail(id);
                }
            });

        });
}