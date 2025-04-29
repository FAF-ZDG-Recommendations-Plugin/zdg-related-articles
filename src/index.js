import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { CheckboxControl, Button, ToggleControl, SelectControl, TextControl, IconButton, PanelBody, TextareaControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { Icon, external, settings } from '@wordpress/icons';

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
    const [startYear, setStartYear] = useState('2023');
    const [startMonth, setStartMonth] = useState('01');

    // State for end date selection (default to current date)
    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const [endYear, setEndYear] = useState(currentYear);
    const [endMonth, setEndMonth] = useState(currentMonth);

    // State for advanced options visibility and keywords
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [mandatoryKeywords, setMandatoryKeywords] = useState('');
    const [optionalKeywords, setOptionalKeywords] = useState('');

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

    // State for API error message
    const [apiError, setApiError] = useState('');

    // Helper function to parse keywords string into array
    const parseKeywords = (keywordsString) => {
        return keywordsString.split(',').map(kw => kw.trim()).filter(kw => kw !== '');
    };

    const fetchSimilarArticles = () => {
        setFetching(true);
        setApiError(''); // Clear any previous error
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
                end_date: `${endYear}-${endMonth}-${new Date(parseInt(endYear), parseInt(endMonth), 0).getDate().toString().padStart(2, '0')}`, // Use last day of selected month
                mandatory_kw: parseKeywords(mandatoryKeywords), // Add mandatory keywords
                optional_kw: parseKeywords(optionalKeywords) // Add optional keywords
            })
        })
        .then(response => {
            if (!response.ok) {
                // If the response status is not OK, throw an error
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Extract articles from the first element of the response array
            if (Array.isArray(data) && data.length >= 1) {
                console.log("Fetched articles:", data);
                
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
                setApiError("Nu s-au găsit articole. Verificați perioada selectată.");
            }
        })
        .catch(error => {
            console.error("Error fetching similar articles:", error);
            setApiError(`Eroare la obținerea articolelor similare: ${error.message}`);
        })
        .finally(() => {
            setFetching(false);
        });
    };

    // State for manual article link input
    const [manualArticleLink, setManualArticleLink] = useState('');
    // State for manual article error message
    const [manualArticleError, setManualArticleError] = useState('');

    const handleAddManualArticle = () => {
        if (manualArticleLink) {
            setManualArticleError(''); // Clear any previous error
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
                    setManualArticleError('Articolul nu a fost găsit.');
                }
            })
            .catch(error => {
                console.error("Error fetching article by post name:", error);
                setManualArticleError(`Eroare la căutarea articolului:${error.message}`);
            });
        }
    };

    return (
        <PluginDocumentSettingPanel name="zdg-related-panel" title="Articole similare">
            <ToggleControl
                label="Afișare articole recomandate"
                __nextHasNoMarginBottom={true}
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
                            __nextHasNoMarginBottom={true}
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
                            // marginBottom: '8px',
                            width: '32px',
                            height: '32px',
                            fontSize: '28px',
                            lineHeight: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        +
                    </Button>
                </div>
                {manualArticleError && (
                    <p style={{ color: 'red'}}>
                        {manualArticleError}
                    </p>
                )}
            </div>
            {/* Advanced Options Section */}
            <label htmlFor="zdg-fetch-similar-articles" style={{ display: 'block', marginTop: '10px', }}>
                    <strong>Căutare automată de articole</strong>
            </label>
            <div 
                id="zdg-advanced-options"
                className={`zdg-advanced-options-container ${showAdvancedOptions ? 'expanded' : ''}`}
                style={{
                    maxHeight: showAdvancedOptions ? '500px' : '0px',
                    opacity: showAdvancedOptions ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.5s ease',
                    visibility: showAdvancedOptions ? 'visible' : 'hidden',
                }}
            >
                <div style={{  
                    backgroundColor: '#f0f0f0', // Slightly darker background
                    padding: '10px',          // Add padding
                    border: '1px solid #ddd', // Optional border for clarity
                    borderRadius: '2px'       // Optional rounded corners
                }}>
                    {/* Start Date Selection */}
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        <strong>Caută începând cu:</strong>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                        <SelectControl
                            __nextHasNoMarginBottom={true}
                            value={ startYear }
                            options={ yearOptions }
                            onChange={ (newYear) => setStartYear(newYear) }
                            style={{ textAlign: 'center' }}
                        />
                        <SelectControl
                            __nextHasNoMarginBottom={true}
                            value={ startMonth }
                            options={ monthOptions }
                            onChange={ (newMonth) => setStartMonth(newMonth) }
                            style={{ textAlign: 'center' }}
                        />
                    </div>
                    {/* End Date Selection */}
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        <strong>Caută până la:</strong>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                        <SelectControl
                            __nextHasNoMarginBottom={true}
                            value={ endYear }
                            options={ yearOptions }
                            onChange={ (newYear) => setEndYear(newYear) }
                            style={{ textAlign: 'center' }}
                        />
                        <SelectControl
                            __nextHasNoMarginBottom={true}
                            value={ endMonth }
                            options={ monthOptions }
                            onChange={ (newMonth) => setEndMonth(newMonth) }
                            style={{ textAlign: 'center' }}
                        />
                    </div>
                    {/* Keywords Input */}
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        <strong>Cuvinte cheie obligatorii (separate prin virgulă)</strong>
                    </label>
                    <TextareaControl
                        __nextHasNoMarginBottom={true}
                        value={ mandatoryKeywords }
                        onChange={ (value) => setMandatoryKeywords(value) }
                        rows={1}
                        style={{ 
                            marginBottom: '10px',
                            padding: '6px 8px',
                            resize: 'none',
                            overflow: 'hidden',
                            maxHeight: '200px',
                         }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }}
                    />
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        <strong>Cuvinte cheie opționale (separate prin virgulă)</strong>
                    </label>
                    <TextareaControl
                        __nextHasNoMarginBottom={true}
                        value={ optionalKeywords }
                        onChange={ (value) => setOptionalKeywords(value)}
                        rows={1}
                        style={{ 
                            padding: '6px 8px',
                            resize: 'none',
                            overflow: 'hidden',
                            maxHeight: '200px',
                         }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }}
                    />
                </div>
            </div>
            
            {/* Fetch Button and Advanced Options Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '5px', maxHeight: '32px'}}>
                <Button 
                    id='zdg-fetch-similar-articles'
                    variant='secondary'
                    onClick={ fetchSimilarArticles } 
                    disabled={ fetching } 
                    style={{ flexGrow: 1, justifyContent: 'center', maxHeight: '32px' }}
                >
                    { fetching ? "Se obține..." : "Obține articole similare" }
                </Button>
                <Button 
                    variant='secondary'
                    id='zdg-advanced-toggle'
                    icon={settings} 
                    label="Opțiuni avansate" 
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} 
                    isPressed={showAdvancedOptions}
                    style={{maxHeight: '32px', maxWidth: '32px', minWidth: '32px'}}
                />
            </div>
            {apiError && (
                <p style={{ color: 'red', marginTop: '5px' }}>
                    {apiError}
                </p>
            )}
            
            <hr style={{marginTop:'10px', marginBottom:'10px'}}></hr>
            <div style={{ marginTop: '10px' }}>
                { articles.map( article => (
                    <div key={ article.ID } style={{ marginBottom: '10px' }}>
                        <CheckboxControl
                            __nextHasNoMarginBottom={true}
                            label={ <strong>{ article.title }</strong> }
                            checked={ selectedArticles.some(item => item.ID === article.ID) }
                            onChange={ () => toggleArticle(article) }
                        />
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontSize: '12px', 
                            color: '#555' 
                            }}>
                               
                            <span>
                                Publicat: { formatDate( article.date ) }
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