import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { CheckboxControl, Button, ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

const articles = [
    { id: 1, title: "Articol 1", link: "https://example.com/article1" },
    { id: 2, title: "Articol 2", link: "https://example.com/article2" },
    { id: 3, title: "Articol 3", link: "https://example.com/article3" },
    { id: 4, title: "Articol 4", link: "https://example.com/article4" },
    { id: 5, title: "Articol 5", link: "https://example.com/article5" },
    { id: 6, title: "Articol 6", link: "https://example.com/article6" },
    { id: 7, title: "Articol 7", link: "https://example.com/article7" },
    { id: 8, title: "Articol 8", link: "https://example.com/article8" },
    { id: 9, title: "Articol 9", link: "https://example.com/article9" },
    { id: 10, title: "Articol 10", link: "https://example.com/article10" },
];

const SidebarPanel = () => {
    // preia meta din editor
    const meta = useSelect( ( select ) => {
        return select( 'core/editor' ).getEditedPostAttribute( 'meta' ) || {};
    }, [] );
    const selectedArticles = meta.zdg_related_articles || [];
    const relatedEnabled = meta.zdg_related_enabled || false;
    const { editPost } = useDispatch( 'core/editor' );
    
    // local state for simulating API fetch
    const [fetching, setFetching] = useState( false );

    const setMeta = ( newMeta ) => {
        editPost( { meta: { ...meta, ...newMeta } } );
    };

    const toggleArticle = ( id ) => {
        const newSelection = selectedArticles.includes( id )
            ? selectedArticles.filter( articleId => articleId !== id )
            : [ ...selectedArticles, id ];
        setMeta({ zdg_related_articles: newSelection });
    };

    const toggleRelatedEnabled = ( value ) => {
        setMeta({ zdg_related_enabled: value });
    };

    const fetchSimilarArticles = () => {
        setFetching( true );
        // Simulare API call
        console.log( "Se obțin articole similare..." );
        setTimeout( () => {
            setFetching( false );
            // In viitor, actualizează lista de articole după răspunsul API
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
                    <CheckboxControl
                        key={ article.id }
                        label={ article.title }
                        checked={ selectedArticles.includes( article.id ) }
                        onChange={ () => toggleArticle( article.id ) }
                    />
                ) ) }
            </div>
            <Button isPrimary style={ { marginTop: '20px' } } onClick={ () => console.log( "Articole selectate:", selectedArticles ) }>
                Salvează selecția
            </Button>
            <div style={ { marginTop: '20px' } }>
                <h3>Articole selectate:</h3>
                <ul>
                    { articles
                        .filter( article => selectedArticles.includes( article.id ) )
                        .map( article => (
                            <li key={ article.id }>
                                <a href={ article.link } target="_blank" rel="noopener noreferrer">
                                    { article.title }
                                </a>
                            </li>
                    ) ) }
                </ul>
            </div>
        </PluginDocumentSettingPanel>
    );
};

registerPlugin( 'zdg-related-plugin', { render: SidebarPanel } );