package main

import (
	"bytes"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"s2/panorama"
	"s2/vpk"
)

// compile DIR OUT.vpk ADDON | decompile FILE | files ARCHIVE [OUTDIR]
func main() {
	a := os.Args[1:]
	switch a[0] {
	case "compile":
		files, err := panorama.CompileTree(a[3], os.DirFS(a[1]))
		must(err)
		var buf bytes.Buffer
		must(vpk.Write(&buf, files))
		must(os.WriteFile(a[2], buf.Bytes(), 0o644))
		fs.WalkDir(files, ".", func(p string, d fs.DirEntry, e error) error {
			if d != nil && !d.IsDir() {
				fmt.Println("  ", p)
			}
			return nil
		})
		fmt.Println("->", a[2], buf.Len(), "bytes")
	case "decompile":
		b, err := os.ReadFile(a[1])
		must(err)
		s, err := panorama.Decompile(b)
		must(err)
		fmt.Print(s)
	case "files":
		b, err := os.ReadFile(a[1])
		must(err)
		m, err := vpk.Files(b)
		must(err)
		for k, v := range m {
			fmt.Println(len(v), k)
			if len(a) > 2 {
				out := filepath.Join(a[2], k)
				os.MkdirAll(filepath.Dir(out), 0o755)
				os.WriteFile(out, v, 0o644)
			}
		}
	}
}

func must(err error) {
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
