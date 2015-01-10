package pb;
import java.sql.*;
import java.util.*;

public class PBdao {
	private PreparedStatement statement;
	private Connection connection;
	public static final String DB_NAME = "CSE";
	public static final String DB_USERNAME = "cse93023";
	public static final String DB_PASSWORD = "4578";
	public static final String DB_URL = "jdbc:derby://indigo.cse.yorku.ca:9999/" + DB_NAME + ";user=" + DB_USERNAME + ";password=" + DB_PASSWORD;

	public PBdao() throws Exception {
		this.connection = DriverManager.getConnection(DB_URL);
	}

	public ArrayList<PBrow> find(String entry) throws Exception {
		this.statement = connection.prepareStatement("SELECT id, lastname, firstname, phone1, comments FROM Contact WHERE UPPER(lastname) LIKE UPPER(?) ORDER BY lastname ASC");
		this.statement.setString(1, "%" + entry + "%");
		ResultSet rs = this.statement.executeQuery();
		PBrow result = null;
		
		ArrayList<PBrow> list = new ArrayList<PBrow>();
		
		while(rs.next()) {
			result = new PBrow();
			result.setId(rs.getInt(1));
			result.setLastName(rs.getString("lastname"));
			result.setFirstName(rs.getString("firstname"));
			result.setTelephone(rs.getString("phone1"));
			result.setComments(rs.getString("comments"));
			list.add(result);
		}
		return list;
	}
}