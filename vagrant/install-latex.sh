latexProfile="$1"/vagrant/texlive-installation.profile

mkdir -p ~/tools/texlive

wget --no-verbose http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
tar xvzf install-tl-unx.tar.gz
rm install-tl-unx.tar.gz
cd install-tl-*
./install-tl --profile="$latexProfile"

export PATH="~/tools/texlive/bin/x86_64-linux:$PATH"

tlmgr install ec babel-finnish hyphen-finnish
