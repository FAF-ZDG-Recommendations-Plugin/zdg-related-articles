import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { CheckboxControl, Button, ToggleControl } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';

// Simulated articles data with extra details: score and publishedAt timestamp
const defaultArticles = [
    { id: 1, title: "Cum tehnologia influențează economia locală", link: "https://example.com/article1", score: 75, publishedAt: "2023-10-01T12:00:00Z" },
    { id: 2, title: "Tendințele modei în 2023: Ce să alegeți", link: "https://example.com/article2", score: 82, publishedAt: "2023-10-02T08:45:00Z" },
    { id: 3, title: "Impactul schimbărilor climatice asupra agriculturii", link: "https://example.com/article3", score: 67, publishedAt: "2023-09-28T16:30:00Z" },
    { id: 4, title: "Inovații în domeniul sănătății: Noi soluții medicale", link: "https://example.com/article4", score: 90, publishedAt: "2023-10-03T10:15:00Z" },
    { id: 5, title: "Povești inspiraționale din lumea afacerilor", link: "https://example.com/article5", score: 78, publishedAt: "2023-09-30T14:20:00Z" },
    { id: 6, title: "Previziuni pentru piața imobiliară din 2024", link: "https://example.com/article6", score: 85, publishedAt: "2023-10-04T09:00:00Z" },
    { id: 7, title: "Sfaturi pentru economisirea energiei în gospodărie", link: "https://example.com/article7", score: 72, publishedAt: "2023-09-29T18:10:00Z" },
    { id: 8, title: "Top destinații de vacanță pentru aventurieri", link: "https://example.com/article8", score: 88, publishedAt: "2023-10-05T11:30:00Z" },
    { id: 9, title: "Recenzii: Cele mai bune gadgeturi ale momentului", link: "https://example.com/article9", score: 80, publishedAt: "2023-09-27T13:45:00Z" },
    { id: 10, title: "Bucătăria tradițională: Rețete autentice românești", link: "https://example.com/article10", score: 76, publishedAt: "2023-10-06T15:25:00Z" },
];

// Updated helper to format the published date
const formatDate = publishedAt => {
    const date = new Date(publishedAt);
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const SidebarPanel = () => {
    // Use the new useEntityProp hook instead of useSelect/useDispatch
    const [meta, setMeta] = useEntityProp('postType', 'post', 'meta');
    
    // Debug logs
    useEffect(() => {
        console.log("Current meta state:", meta);
    }, [meta]);

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
    const [articles, setArticles] = useState(defaultArticles);

    // Update the toggle
    const toggleRelatedEnabled = (value) => {
        setMeta({
            ...meta,
            zdg_related_enabled: value
        });
    };

    // Update the article selection
    const toggleArticle = (id) => {
        const newSelection = selectedArticles.includes(id)
            ? selectedArticles.filter(articleId => articleId !== id)
            : [...selectedArticles, id];
            
        console.log("Setting new selection:", newSelection);
        setMeta({
            ...meta,
            zdg_related_articles: JSON.stringify(newSelection)
        });
    };

    const fetchSimilarArticles = () => {
        setFetching( true );
        console.log( "Se obțin articole similare..." );
        // Simulate API call delay and response update
        setTimeout(() => {
            // In real implementation, update articles via API response.
            setFetching( false );
            // ...existing code may update articles state...
        }, 1000 );
    };

    return (
        <PluginDocumentSettingPanel name="zdg-related-panel" title="Articole similare">
            <ToggleControl
                label="Activează articole similare"
                checked={ relatedEnabled }
                onChange={ toggleRelatedEnabled }
            />
            <Button isSecondary onClick={ fetchSimilarArticles } disabled={ fetching }>
                { fetching ? "Se obține..." : "Obține articole similare" }
            </Button>
            <div style={ { marginTop: '20px' } }>
                { articles.map( article => (
                    <div key={ article.id } style={ { marginBottom: '10px' } }>
                        <CheckboxControl
                            label={ <strong>{ article.title }</strong> }
                            checked={ selectedArticles.includes( article.id ) }
                            onChange={ () => toggleArticle( article.id ) }
                        />
                        <Button isSmall onClick={ () => window.open(article.link, '_blank') }>
                            Deschide
                        </Button>
                        <div style={ { fontSize: '12px', color: '#555' } }>
                            Similitudine: { article.score } | Publicat: { formatDate( article.publishedAt ) }
                        </div>
                    </div>
                )) }
            </div>
            {/* <Button isPrimary style={ { marginTop: '20px' } } onClick={ () => console.log( "Articole selectate:", selectedArticles ) }>
                Salvează selecția
            </Button> */}
        </PluginDocumentSettingPanel>
    );
};

registerPlugin('zdg-related-plugin', { render: SidebarPanel });
