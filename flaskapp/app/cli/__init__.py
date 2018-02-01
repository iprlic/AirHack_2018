#!/usr/bin/env python
from app.utils.imports import import_submodules

# Import all submodules (commands)
import_submodules(locals(), __name__, __path__)
