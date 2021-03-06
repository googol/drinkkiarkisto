# -*- mode: ruby -*-
# vi: set ft=ruby :

# First some installation scripts, vagrant conf itself is lower down

# The base box only has the C locale installed, these should cover most uses
$generate_locales = <<SCRIPT
locale-gen fi_FI.UTF-8
locale-gen en_US.UTF-8
SCRIPT

# Installs absolute minimun for building/running
$install_packages = <<SCRIPT
curl --silent --location https://deb.nodesource.com/setup_5.x | sudo bash -
apt-get install --no-install-recommends -y build-essential git postgresql nodejs

npm install -g npm || exit 1
SCRIPT

# Some configuration changes need to be made to postgres to allow local
# logins with passwords.
$configure_postgres = <<SCRIPT
cp /vagrant/vagrant/pg_hba.conf /etc/postgresql/9.3/main/
service postgresql reload
SCRIPT

# To enable global installations with npm without using sudo, change
# ownership of some directories to the vagrant default user.
$ensure_permissions = <<SCRIPT
vagrant_user="vagrant"
bin="/usr/bin"
node_modules="/usr/lib/node_modules"

mkdir -p "$bin"
mkdir -p "$node_modules"
chown "$vagrant_user" "$bin"
chown -R "$vagrant_user" "$node_modules"
SCRIPT

# Set the NODE_ENV environment variable, and the default login location
# This script will be run as the unprivileged development user.
$configure_dotprofile = <<SCRIPT
profile_dir=~/.profile
locale="en_US.UTF-8"

export_env_if_unset() {
  if [ -z "${!1}" ]; then
    echo "export $1=$2" >> "$profile_dir"
  fi
}

source "$profile_dir"

export_env_if_unset "NODE_ENV" "dev"
export_env_if_unset "LANG" "$locale"
export_env_if_unset "LANGUAGE" "$locale"
export_env_if_unset "LC_ALL" "$locale"
export_env_if_unset "DATABASE_URL" "postgres://vagrant:vagrant@localhost/vagrant"

if [ $(pwd) != "/vagrant" ]; then
  echo "cd /vagrant" >> "$profile_dir"
fi

echo "export PATH=\"/home/vagrant/tools/texlive/bin/x86_64-linux:\$PATH\"" >> "$profile_dir"
SCRIPT

# Finally install npm dependencies and setup development database.
# Vagrant mounts the project directory at /vagrant.
# This script will be run as the unprivileged development user.
$install_project = <<SCRIPT
cd /vagrant

rm -rf node_modules
npm install || exit 1

sudo -u postgres -- psql template1 -f /vagrant/sql/drop-database-and-user.sql
sudo -u postgres -- psql template1 -f /vagrant/sql/create-database-and-user.sql
PGPASSWORD=vagrant psql vagrant vagrant -f /vagrant/sql/create-tables.sql
PGPASSWORD=vagrant psql vagrant vagrant -f /vagrant/sql/add-test-data.sql
exit 0
SCRIPT

Vagrant.configure(2) do |config|
  # The development virtual machine will run Ubuntu 14.04 Trusty Tahr
  config.vm.box = "ubuntu/trusty64"
  # Forward port 3000 into the virtual machine to be able to access
  # the software from the host
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  # By default 512MB of memory is reserved for the machine, but npm requires
  # more for some operations. This proved to be enough, though it might be
  # able to survive with less.
  config.vm.provider "virtualbox" do |v|
    v.memory = 1536
  end
  # Run provisioning scripts in this order.
  config.vm.provision "shell", inline: $generate_locales
  config.vm.provision "shell", inline: $install_packages
  config.vm.provision "shell" do |s|
    s.privileged = false
    s.path = "vagrant/install-latex.sh"
    s.args = ["/vagrant"]
  end
  config.vm.provision "shell", inline: $configure_postgres
  config.vm.provision "shell", inline: $ensure_permissions
  # environment setup, npm installations and project setup need to be run
  # as the development user
  config.vm.provision "shell" do |s|
    s.privileged = false
    s.inline = $configure_dotprofile
  end
  config.vm.provision "shell" do |s|
    s.privileged = false
    s.inline = $install_project
  end
end
