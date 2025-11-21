--# ================================
--# 🔐 GITHUB ACCOUNT MANAGEMENT
--# ================================

--# 👉 Check which GitHub accounts are logged in (GCM)
git credential-manager github list

--# 👉 Logout a specific GitHub account
git credential-manager github logout <account-name>
--# Example:
git credential-manager github logout idipangkar-ai

--# 👉 Logout ALL GitHub accounts (if supported)
git credential-manager github logout *

--# 👉 Also clear Windows Credential Manager (manual):
--# Control Panel → Credential Manager → Windows Credentials → remove anything with:
--#   - git:
--#   - github
--#   - ghp_...
--#   - git:https://github.com

--# ================================
--# 🛰️ REMOTE (REPO) MANAGEMENT
--# ================================

--# 👉 Check which repo the folder is connected to
git remote -v

--# 👉 Remove the current remote completely
git remote remove origin

--# 👉 Add a NEW GitHub repo (new account / new project)
git remote add origin https://github.com/<username>/<repo>.git
--# Example:
git remote add origin https://github.com/Hello-World-Only/KuthaKo-BE.git

--# 👉 Rename / change branch to main (recommended)
git branch -M main

--# 👉 First push (will ask for login)
git push -u origin main

--# ================================
--# 👤 GIT GLOBAL IDENTITY (OPTIONAL)
--# ================================

--# 👉 Check your global identity
git config --global user.name
git config --global user.email

--# 👉 Remove your identity (logout)
git config --global --unset user.name
git config --global --unset user.email

--# 👉 Set new identity
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

--# ================================
--# 🚀 COMMON RESET / FIX COMMANDS
--# ================================

--# 👉 "src refspec main does not match any" fix
git add .
git commit -m "init"
git branch -M main
git push -u origin main

--# 👉 "fatal: remote origin already exists" fix
git remote remove origin
--# then add new one again

--# 👉 Force push if needed
git push --force

--# ================================
--# ⭐ END CHEAT SHEET ⭐
--# ================================
