Param(
  [string]$From = "develop",
  [string]$To = "main",
  [string]$Title = "Auto PR: develop -> main",
  [string]$Body = "Automated PR from develop to main",
  [string]$RepoPath = "",
  [string]$CommitMessage = "",
  [switch]$Squash,
  [switch]$NoDeleteBranch
)

function Require-Command {
  Param([Parameter(Mandatory=$true)][string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' not found. Please install it and try again."
  }
}

function Resolve-Gh {
  $cmd = Get-Command gh -ErrorAction SilentlyContinue
  if ($cmd) { return $true }
  $candidates = @(
    "$Env:ProgramFiles\GitHub CLI\gh.exe",
    "$Env:LOCALAPPDATA\Programs\GitHub CLI\gh.exe"
  )
  foreach ($p in $candidates) {
    if (Test-Path $p) {
      Set-Alias -Name gh -Value $p -Scope Local
      return $true
    }
  }
  return $false
}

try {
  Require-Command -Name git
  if (-not (Resolve-Gh)) {
    throw "GitHub CLI (gh) not found in PATH. Install it or open a new terminal after installing."
  }

  if ($RepoPath -and $RepoPath.Trim() -ne "") {
    Push-Location -Path $RepoPath
  }

  $cwd = Get-Location
  if (-not (Test-Path (Join-Path $cwd ".git"))) {
    throw "Directory '$cwd' is not a Git repository (missing .git)."
  }

  # Verify GitHub CLI auth
  gh auth status *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "GitHub CLI is not authenticated. Run: gh auth login"
  }

  Write-Host "Fetching latest refs from origin..." -ForegroundColor Cyan
  git fetch origin
  if ($LASTEXITCODE -ne 0) { throw "git fetch failed" }

  # Ensure source branch exists locally or create from origin
  git show-ref --verify --quiet "refs/heads/$From"
  if ($LASTEXITCODE -eq 0) {
    git checkout $From
  } else {
    Write-Host "Local branch '$From' not found. Creating from origin/$From..." -ForegroundColor Yellow
    git checkout -b $From "origin/$From"
  }
  if ($LASTEXITCODE -ne 0) { throw "Failed to checkout '$From'" }

  # Optional auto-commit
  if ($CommitMessage -and $CommitMessage.Trim() -ne "") {
    Write-Host "Committing local changes..." -ForegroundColor Cyan
    git add -A
    git commit -m $CommitMessage 2>$null
    # Ignore non-zero exit if there is nothing to commit
  }

  Write-Host "Rebasing '$From' with origin/$From..." -ForegroundColor Cyan
  git pull --rebase origin $From
  if ($LASTEXITCODE -ne 0) { throw "git pull --rebase failed (conflicts?)" }

  Write-Host "Pushing '$From' to origin..." -ForegroundColor Cyan
  git push -u origin $From
  if ($LASTEXITCODE -ne 0) { throw "git push failed" }

  # Check if PR already exists
  $existingPrNumber = gh pr list --base $To --head $From --state open --json number --jq '.[0].number'
  if (-not $existingPrNumber) {
    Write-Host "Creating PR from '$From' to '$To'..." -ForegroundColor Cyan
    $null = gh pr create --base $To --head $From --title $Title --body $Body
    if ($LASTEXITCODE -ne 0) { throw "gh pr create failed" }
  } else {
    Write-Host "Open PR already exists (#$existingPrNumber)." -ForegroundColor Yellow
  }

  # Resolve PR number for merge
  $prNumber = gh pr view --head $From --json number --jq '.number'
  if (-not $prNumber) { throw "Could not determine PR number for '$From' -> '$To'" }

  $mergeMode = if ($Squash) { "--squash" } else { "--merge" }
  $deleteBranchFlag = if ($NoDeleteBranch) { "" } else { "--delete-branch" }

  Write-Host "Merging PR #$prNumber ($From -> $To)..." -ForegroundColor Cyan
  if ($deleteBranchFlag -ne "") {
    gh pr merge $prNumber $mergeMode $deleteBranchFlag --auto=false
  } else {
    gh pr merge $prNumber $mergeMode --auto=false
  }
  if ($LASTEXITCODE -ne 0) { throw "gh pr merge failed (checks failing or protections?)" }

  Write-Host "Checking out '$To' and pulling latest..." -ForegroundColor Cyan
  git checkout $To
  if ($LASTEXITCODE -ne 0) { throw "Failed to checkout '$To'" }
  git pull origin $To
  if ($LASTEXITCODE -ne 0) { throw "git pull failed on '$To'" }

  Write-Host "Done. '$From' merged into '$To' and local '$To' is up to date." -ForegroundColor Green
}
catch {
  Write-Error $_
  exit 1
}
finally {
  if ($RepoPath -and $RepoPath.Trim() -ne "") {
    Pop-Location
  }
}
