// Description: It is used to render the page. -> Not used in the project.
// not used in the project
exports.renderProfile = (req, res) => {
    res.render('profile', { title: 'Profile' });
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: 'Join' });
};

exports.renderMain = (req, res) => {
    res.render('main', { title: 'Main' });
};

exports.renderSearch = (req, res) => {
    res.render('search', { title: 'Search' });
};