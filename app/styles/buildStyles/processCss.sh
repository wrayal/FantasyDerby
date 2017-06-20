#!/bin/bash
cp mainbase.less tempbase.less
lessc main.less "../main.css"
FILES=bases/*
for f in $FILES
do
	cp "bases/$(basename $f)" ./tempbase.less
	lessc main.less "../main$(basename $f).css"
done
rm tempbase.less
