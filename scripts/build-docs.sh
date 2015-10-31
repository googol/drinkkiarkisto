cd doc

for i in $(seq 1 2);
do
  pdflatex -shell-escape documentation.tex;
done

cd ..
mkdir -p public/doc
cp doc/documentation.pdf public/doc/
