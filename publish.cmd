call npm run build
call git add dist -f
call git commit -m 'publish'
call git subtree push --prefix dist origin gh-pages
call git reset HEAD~1
call git rm dist -r