# OneRing — shared zshrc
export HISTSIZE=50000
export SAVEHIST=50000
export HISTFILE="${HOME}/.zsh_history"

[[ -d "${HOME}/.zshrc.d" ]] || mkdir -p "${HOME}/.zshrc.d"
[[ -f "${HOME}/.zshrc.d/aliases.zsh" ]] && source "${HOME}/.zshrc.d/aliases.zsh"

# Add plugin paths here if you install zsh-autosuggestions / syntax-highlighting / powerlevel10k
