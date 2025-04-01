import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { CheckboxControl, Button, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { Icon, external } from '@wordpress/icons';

// Updated helper to format the published date
const formatDate = publishedAt => {
    const date = new Date(publishedAt);
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const SidebarPanel = () => {
    // Use the new useEntityProp hook instead of useSelect/useDispatch
    const [meta, setMeta] = useEntityProp('postType', 'post', 'meta');
    
    // Get the post content using useSelect
    const postContent = useSelect((select) =>
        select('core/editor').getEditedPostAttribute('content')
    );
    
    // Debug logs
    useEffect(() => {}, [meta]);

    // Parse the selected articles from the string in meta
    const selectedArticles = (() => {
        try {
            return JSON.parse(meta.zdg_related_articles || '[]');
        } catch (e) {
            console.error("Error parsing saved articles", e);
            return [];
        }
    })();
    
    const relatedEnabled = meta.zdg_related_enabled || false;
    
    // Local state for article list and fetching state
    const [fetching, setFetching] = useState(false);
    const [articles, setArticles] = useState(selectedArticles);

    // State for start date selection
    const [startYear, setStartYear] = useState('2015');
    const [startMonth, setStartMonth] = useState('01');

    // Options for year selection (adjust as needed)
    const yearOptions = Array.from({ length: (new Date()).getFullYear() - 2007 }, (_, i) => {
        const year = 2008 + i;
        return { label: year.toString(), value: year.toString() };
    }).reverse();

    // Options for month selection
    const monthOptions = [
        { label: 'Ianuarie', value: '01' },
        { label: 'Februarie', value: '02' },
        { label: 'Martie', value: '03' },
        { label: 'Aprilie', value: '04' },
        { label: 'Mai', value: '05' },
        { label: 'Iunie', value: '06' },
        { label: 'Iulie', value: '07' },
        { label: 'August', value: '08' },
        { label: 'Septembrie', value: '09' },
        { label: 'Octombrie', value: '10' },
        { label: 'Noiembrie', value: '11' },
        { label: 'Decembrie', value: '12' },
    ];

    // Update the toggle
    const toggleRelatedEnabled = (value) => {
        setMeta({
            ...meta,
            zdg_related_enabled: value
        });
    };

    // Update the article selection - store complete article object
    const toggleArticle = (article) => {
        let newSelection;
        
        // Check if this article is already selected by comparing IDs
        const isSelected = selectedArticles.some(item => item.ID === article.ID);
        
        if (isSelected) {
            // Remove the article from selection
            newSelection = selectedArticles.filter(item => item.ID !== article.ID);
        } else {
            // Add the complete article object to selection
            newSelection = [...selectedArticles, article];
        }
            
        setMeta({
            ...meta,
            zdg_related_articles: JSON.stringify(newSelection)
        });
    };

    const fetchSimilarArticles = () => {
        setFetching(true);
        // Extract text content from HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = postContent || '';
        const textContent = tempDiv.innerText.replace(/\s+/g, ' ').trim();
        
        // Get the IDs of already selected articles
        const selectedIds = selectedArticles.map(article => article.ID);
        
        fetch("http://localhost:5000/api/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query_text: textContent,
                top_k: 10,  // Always fetch 10 articles
                start_date: `${startYear}-${startMonth}-01`, // Use selected start date
                end_date: ""
                // Removed exclude_ids since API doesn't support it
            })
        })
        .then(response => response.json())
        .then(data => {
            // Extract articles from the first element of the response array
            if (Array.isArray(data) && data.length >= 1) {
                const newArticlesData = data[0];
                
                // Filter out articles that are already selected
                const filteredNewArticles = newArticlesData.filter(
                    newArticle => !selectedIds.includes(newArticle.ID)
                );
                
                // Keep only enough new articles to have a total of 10 (including selected)
                const maxNewArticlesToAdd = Math.max(10 - selectedArticles.length, 0);
                const limitedNewArticles = filteredNewArticles.slice(0, maxNewArticlesToAdd);
                
                // Set articles to be the combination of selected and new filtered articles
                setArticles([...selectedArticles, ...limitedNewArticles]);
            } else {
                console.error("Unexpected API response format:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching similar articles:", error);
        })
        .finally(() => {
            setFetching(false);
        });
    };

    // State for manual article link input
    const [manualArticleLink, setManualArticleLink] = useState('');

    const handleAddManualArticle = () => {
        if (manualArticleLink) {
            // Extract post name from the link (example: https://www.example.com/post-name/ -> post-name)
            const postName = manualArticleLink.split('/').filter(Boolean).pop();
            // Make an API request to a custom endpoint to fetch article data by post name
            fetch(`${zdgApi.baseUrl}zdg-related-articles/v1/article-by-name?post_name=${postName}`, {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': zdgApi.nonce
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data && data.ID) {
                        // Add the fetched article to selected articles
                        toggleArticle(data);
                        // Also add the article to the local articles state if not already included
                        setArticles(prevArticles => {
                            if (prevArticles.some(article => article.ID === data.ID)) {
                                return prevArticles;
                            }
                            return [...prevArticles, data];
                        });
                        // Clear the input field
                        setManualArticleLink('');
                    } else {
                        alert('Articolul nu a fost găsit.');
                    }
                })
                .catch(error => {
                    console.error("Error fetching article by post name:", error);
                    alert('Eroare la căutarea articolului.');
                });
        }
    };

    return (
        <PluginDocumentSettingPanel name="zdg-related-panel" title="Articole similare">
            <ToggleControl
                label="Activează articole similare"
                checked={ relatedEnabled }
                onChange={ toggleRelatedEnabled }
            />
            {/* Manual article link input with separate label */}
            <div style={{ marginTop: '10px' }}>
                <label htmlFor="manual-article-link" style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Adaugă un articol manual (Link)</strong>
                </label>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <div style={{ flexGrow: '1' }}>
                        <TextControl
                            id="manual-article-link"
                            placeholder="https://www.zdg.com/articol"
                            type="url"
                            value={ manualArticleLink }
                            onChange={ (newLink) => setManualArticleLink(newLink) }
                            style={{
                                width: '100%',
                            }}
                        />
                    </div>
                    <Button
                        isSecondary
                        onClick={ handleAddManualArticle }
                        style={{
                            paddingBottom: '12px',
                            marginLeft: '5px',
                            marginBottom: '8px',
                            width: '32px',
                            height: '32px',
                            fontSize: '30px',
                            lineHeight: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        +
                    </Button>
                </div>
            </div>
            {/* Year and Month selection */}
            <div style={{ marginTop: '5px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Caută începând cu:</strong>
                </label>
                <div style={{ width: 'fit-content'}}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        width: 'fit-content',
                    }}>
                        <SelectControl
                            value={ startYear }
                            options={ yearOptions }
                            onChange={ (newYear) => setStartYear(newYear) }
                            style={{ textAlign: 'center' }}
                        />
                        <SelectControl
                            value={ startMonth }
                            options={ monthOptions }
                            onChange={ (newMonth) => setStartMonth(newMonth) }
                            style={{ textAlign: 'center' }}
                        />
                    </div>
                    <Button 
                        isSecondary 
                        onClick={ fetchSimilarArticles } 
                        disabled={ fetching } 
                        style={{
                            width: '100%', 
                            alignItems: 'center',
                            justifyContent: 'center' 
                        }}>
                        { fetching ? "Se obține..." : "Obține articole similare" }
                    </Button>
                </div>
            </div>
            
            
            <hr style={{marginTop:'10px', marginBottom:'10px'}}></hr>
            <div style={{ marginTop: '10px' }}>
                { articles.map( article => (
                    <div key={ article.ID } style={{ marginBottom: '10px' }}>
                        <CheckboxControl
                            label={ <strong>{ article.title }</strong> }
                            checked={ selectedArticles.some(item => item.ID === article.ID) }
                            onChange={ () => toggleArticle(article) }
                        />
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            // marginLeft: '26px', 
                            fontSize: '12px', 
                            color: '#555' 
                            }}>
                            <span>
                                Similitudine: { Math.round(article.score * 100) }% | Publicat: { formatDate( article.date ) }
                            </span>
                            <Button 
                                isSmall 
                                onClick={ () => window.open(article.url, '_blank') }
                                variant="link"
                                style={{
                                    padding: '0',
                                }}
                            >
                                <Icon icon={external} />
                            </Button>
                        </div>
                    </div>
                )) }
            </div>
        </PluginDocumentSettingPanel>
    );
};

// registerPlugin('zdg-related-plugin', { render: SidebarPanel });
if (!window.zdgPluginRegistered) {
    registerPlugin("zdg-related-plugin", {
        render: SidebarPanel, 
    });
    window.zdgPluginRegistered = true;
}