npm run build
git add dist -f
git commit -m 'publish'
git subtree push --prefix dist origin gh-pages