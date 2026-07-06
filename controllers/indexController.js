/**
 * Renders the home page dashboard
 */
export const renderHome = (req, res) => {
    res.render('pages/index', {
        title: 'Welcome Dashboard',
        activePage: 'home'
    });
};

/**
 * Renders the about page
 */
export const renderAbout = (req, res) => {
    res.render('pages/about', {
        title: 'About Us',
        activePage: 'about'
    });
};
